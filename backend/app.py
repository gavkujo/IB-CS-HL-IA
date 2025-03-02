from flask import Flask, request, jsonify
import csv
import os
from flask_cors import CORS  
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["*"])

# CSV File Path
PRODUCTS_CSV = "backend/data/products.csv"
ORDERS_CSV = "backend/data/orders.csv"
EXPENSES_CSV = "backend/data/expenses.csv"
USERS_CSV = "backend/data/users.csv"


# Function to load products from CSV
def load_products():
    if not os.path.exists(PRODUCTS_CSV):
        return []

    with open(PRODUCTS_CSV, mode="r", newline="") as file:
        reader = csv.DictReader(file)
        products = []
        
        for row in reader:
            try:
                product = {
                    "id": int(row["id"]),  # Ensure ID is an integer
                    "name": row["name"],
                    "image_url": row["image_url"],  # Match CSV header
                    "quantity": int(row["quantity"]),  # Convert to int
                    "cost": float(row["cost"]),  # Convert to float
                    "category": row["category"]
                }
                products.append(product)
            except ValueError as e:
                print(f"⚠️ Error parsing row {row}: {e}")  # Debugging

        print("✅ Loaded Products:", products)  # Debugging output
        return products

# Function to save a new product to CSV
def save_product(product):
    file_exists = os.path.exists(PRODUCTS_CSV)

    with open(PRODUCTS_CSV, mode="a", newline="") as file:
        fieldnames = ["id", "name", "image_url", "quantity", "cost", "category"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        # Write header if file is newly created
        if not file_exists:
            writer.writeheader()

        # Auto-generate product ID
        product_id = sum(1 for _ in open(PRODUCTS_CSV))  # Count lines
        product["id"] = product_id  # Assign ID

        writer.writerow(product)

# Route to fetch all products
@app.route("/products", methods=["GET"])
def get_products():
    products = load_products()
    return jsonify(products)

# Route to add a new product
@app.route("/add_product", methods=["POST"])
def add_product():
    data = request.json

    # Debug the incoming request data
    print("📡 Incoming data:", data)

    # Validate input
    required_keys = ["name", "image_url", "quantity", "cost", "category"]
    missing_keys = [key for key in required_keys if key not in data]
    
    if missing_keys:
        return jsonify({"error": f"Missing fields: {', '.join(missing_keys)}"}), 400

    # Convert values and store
    product = {
        "name": data["name"],
        "image_url": data["image_url"],
        "quantity": str(data["quantity"]),  # Store as string in CSV
        "cost": str(data["cost"]),
        "category": data["category"]
    }

    save_product(product)
    return jsonify({"message": "Product added successfully!"})

# Load all orders from CSV
def load_orders():
    if not os.path.exists(ORDERS_CSV):
        return []

    with open(ORDERS_CSV, mode="r", newline="") as file:
        reader = csv.DictReader(file)
        orders = [row for row in reader]

    print("✅ Loaded Orders:", orders)  
    return orders

# Save a new order to CSV
def save_order(order):
    orders = load_orders()  # Get existing orders
    new_id = len(orders) + 1  # Generate a new unique ID

    order["id"] = str(new_id)  # Convert ID to string (for CSV compatibility)

    file_exists = os.path.exists(ORDERS_CSV)

    with open(ORDERS_CSV, mode="a", newline="") as file:
        fieldnames = ["id", "name", "quantity", "cost", "email", "order_date", "delivery_location"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # Write header only if the file doesn't exist

        writer.writerow(order)

# Route to fetch all orders
@app.route("/orders", methods=["GET"])
def get_orders():
    orders = load_orders()
    return jsonify(orders)

# Route to add a new order
@app.route("/orders", methods=["POST"])
def add_order():
    data = request.json
    print("📡 Incoming order data:", data)

    # Required fields
    required_keys = ["name", "quantity", "cost", "email", "order_date", "delivery_location"]
    missing_keys = [key for key in required_keys if key not in data]
    
    if missing_keys:
        return jsonify({"error": f"Missing fields: {', '.join(missing_keys)}"}), 400

    # Store data
    order = {
        "name": data["name"],
        "quantity": str(data["quantity"]),  # Ensure string format for CSV
        "cost": str(data["cost"]),
        "email": data["email"],
        "order_date": data["order_date"],
        "delivery_location": data["delivery_location"]
    }

    save_order(order)
    return jsonify({"message": "✅ Order added successfully!"}), 201

# Function to load transactions from CSV
def load_transactions():
    if not os.path.exists(EXPENSES_CSV):
        return []

    with open(EXPENSES_CSV, mode="r", newline="") as file:
        reader = csv.DictReader(file)
        transactions = []
        
        for row in reader:
            transactions.append(row)

        print("✅ Loaded Transactions:", transactions)  
        return transactions

# Function to save a new transaction to CSV
def save_transaction(transaction):
    # Load current transactions to determine the next ID
    transactions = load_transactions()
    new_id = len(transactions) + 1  # New ID is one more than the current length of the list

    transaction["id"] = new_id  # Assign ID to the new transaction

    # Append the transaction with the generated ID
    file_exists = os.path.exists(EXPENSES_CSV)

    with open(EXPENSES_CSV, mode="a", newline="") as file:
        fieldnames = ["id", "transaction_type", "amount", "transaction_date"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow(transaction)

# Route to fetch all transactions
@app.route("/expenses", methods=["GET"])
def get_expenses():
    transactions = load_transactions()
    return jsonify(transactions)

# Route to add a new transaction
@app.route("/add_expense", methods=["POST"])
def add_expense():
    data = request.json

    print("📡 Incoming transaction data:", data)

    # Validate input
    required_keys = ["transaction_type", "amount", "transaction_date"]
    missing_keys = [key for key in required_keys if key not in data]
    
    if missing_keys:
        return jsonify({"error": f"Missing fields: {', '.join(missing_keys)}"}), 400

    # Convert values and store
    transaction = {
        "transaction_type": data["transaction_type"],
        "amount": int(data["amount"]),
        "transaction_date": data["transaction_date"]
    }

    save_transaction(transaction)
    return jsonify({"message": "Transaction added successfully!"})

# Hash passwords for security
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Load users from CSV
def load_users():
    if not os.path.exists(USERS_CSV):
        return []

    with open(USERS_CSV, mode="r", newline="") as file:
        reader = csv.DictReader(file)
        return list(reader)

# Generate a new user ID
def generate_user_id():
    users = load_users()
    return str(len(users) + 1)  # ID starts from 1 and increments

# Save new user to CSV
def save_user(name, email, password):
    users = load_users()
    
    # Check if email already exists
    if any(user["email"] == email for user in users):
        return False, "Email already registered."

    user_id = generate_user_id()
    hashed_password = hash_password(password)  # Hash the password
    file_exists = os.path.exists(USERS_CSV)

    with open(USERS_CSV, mode="a", newline="") as file:
        fieldnames = ["id", "name", "email", "password", "role"]  # Correct order
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # Write headers if file is new

        writer.writerow({
            "id": user_id, 
            "name": name, 
            "email": email, 
            "password": hashed_password,
            "role": "user"  # Default role is "user"
        })

    return True, "Registration successful!"

# Register user
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required!"}), 400

    success, message = save_user(name, email, password)
    status_code = 201 if success else 400
    return jsonify({"message": message}), status_code

# Login user
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()
    hashed_password = hash_password(password)

    for user in users:
        if user["email"] == email and user["password"] == hashed_password:
            return jsonify({
                "message": "Login successful!", 
                "id": user["id"], 
                "name": user["name"], 
                "email": user["email"], 
                "role": user["role"]
            }), 200  # Return user details including ID and role

    return jsonify({"message": "Invalid email or password."}), 401

def filter_by_date(csv_file, start_date, end_date, amount_column="amount", count_column=None):
    if not os.path.exists(csv_file):
        return 0  # No records found

    total = 0
    count = 0
    try:
        with open(csv_file, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Determine which column to use for date comparison
                date_column = "transaction_date" if "transaction_date" in row else "order_date"
                record_date = datetime.strptime(row[date_column], "%Y-%m-%d")  # Convert date string to datetime

                if start_date <= record_date <= end_date:
                    if count_column:  # If we are counting rows (like order count)
                        count += 1
                    else:  # Otherwise, we sum the amounts
                        try:
                            total += float(row[amount_column])  # Try to add the amount to total
                        except ValueError:
                            continue  # Skip rows with invalid amount values
    except Exception as e:
        return str(e)  # Return error if anything goes wrong

    return count if count_column else total  # Return the count for orders or total for expenses

@app.route("/get_summary", methods=["GET"])
def get_summary():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({"message": "Start and end dates are required!"}), 400

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

    total_expenses = filter_by_date(EXPENSES_CSV, start_date, end_date, "amount")  # Sum of expenses
    total_orders = filter_by_date(ORDERS_CSV, start_date, end_date, count_column=True)  # Count of orders

    return jsonify({
        "total_expenses": total_expenses,
        "total_orders": total_orders
    })

# Route to get users from CSV
@app.route("/get_users", methods=["GET"])
def get_users():
    if not os.path.exists(USERS_CSV):
        return jsonify({"message": "No users found."}), 404

    users = []
    try:
        with open(USERS_CSV, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                users.append(row)
    except Exception as e:
        return jsonify({"message": f"Error reading file: {str(e)}"}), 500

    return jsonify(users)


# Route to delete a user from CSV
@app.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    admin_role = request.headers.get("User-Role")  # Get user role from request header

    if admin_role != "admin":
        return jsonify({"message": "Unauthorized: Only admins can delete users."}), 403  # Forbidden

    users = []
    user_found = False

    with open(USERS_CSV, mode="r", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            if int(row["id"]) != user_id:
                users.append(row)
            else:
                user_found = True

    if not user_found:
        return jsonify({"message": "User not found."}), 404

    with open(USERS_CSV, mode="w", newline="") as file:
        fieldnames = ["id", "name", "email", "password", "role"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for user in users:
            writer.writerow(user)

    return jsonify({"message": "User deleted successfully!"}), 200


# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
