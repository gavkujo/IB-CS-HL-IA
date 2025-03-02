// Function to fetch products from Flask backend
async function fetchProducts() {
    try {
        const response = await fetch("https://ib-cs-hl-ia.onrender.com/products");
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched products:", data); // Debugging

        // Clear existing products before appending new ones
        const productGrid = document.getElementById("product-grid");
        if (!productGrid) {
            console.error("❌ ERROR: 'product-grid' not found in HTML.");
            return;
        }
        productGrid.innerHTML = "";

        // Display each product
        data.forEach(displayProduct);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
    }
}

// Function to display a product
function displayProduct(product) {
    const productGrid = document.getElementById("product-grid");

    if (!productGrid) {
        console.error("❌ ERROR: 'product-grid' not found in HTML.");
        return;
    }

    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>Quantity: ${product.quantity}</p>
        <p>Cost: $${product.cost.toFixed(2)}</p>
        <p>Category: ${product.category}</p>
    `;

    productGrid.appendChild(productCard);
}

// Fetch and display products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);

// Handle form submission to add a new product
document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("productName").value;
    const image_url = document.getElementById("productImage").value;
    const quantity = document.getElementById("quantity").value;
    const cost = document.getElementById("cost").value;
    const category = document.getElementById("category").value;

    // Create new product object
    const newProduct = {
        name,
        image_url,
        quantity: parseInt(quantity, 10),
        cost: parseFloat(cost),
        category,
    };

    console.log("🔹 Sending product data:", newProduct);  // Debugging output

    try {
        // Send product data to Flask backend
        const response = await fetch("https://ib-cs-hl-ia.onrender.com/add_product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error adding product:", error);
            alert(`Error: ${error.error}`);
            return;
        }

        const result = await response.json();
        alert(result.message); // Show success message

        // Refresh product list
        fetchProducts();

        // Reset form
        document.getElementById("productForm").reset();
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

