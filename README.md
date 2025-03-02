# Introduction:

Chatterbox (CTBX) is a student-run school café; essentially, it’s a café where students, teachers and parents can buy snacks, coffee, and other drinks. However, there are a few problems that the café faces, such as losing track of the remaining stocks and the products that have been sold and forgetting how much money is spent or earned. There are also issues with not knowing what products are popular or bring profit. Currently, the system used is very manual, and it’s inefficient. Constantly forgetting and losing track makes it hard to stay efficient. 

# Solution:

To address these problems, I am developing a web-based solution that streamlines stock and sales management at CTBX. The system will automatically track product availability, ensuring stock levels are updated in real-time. It will also record transactions, allowing for an accurate evaluation of the most popular products. Financial reporting will be a main feature, summarizing earnings, expenses, and net profits over different periods. To make the data more accessible and insightful, I will use data visualizations that display sales trends and stock levels through graphical representations. The frontend will be made using HTML, CSS, and JavaScript, with data visualizations. For the backend, I will use Flask (Python) to handle data processing and API requests. Data will be stored in CSV files, ensuring a lightweight and efficient solution for managing stock, sales, and financial data. Finally, user access control will be implemented, allowing only authorized café managers to manage and modify data efficiently.

- Backend: Flask (Python)
- Frontend: HTML, CSS, JavaScript
- Data Storage: CSV file

# Setting it up:

### Step 1: Run the server using flask

- Go into the projects directory and install the dependencies using the following command:

```
pip install flask flask-cors
```
OR
```
pip install -r requirements.txt
```

- Run the following command in the project directory:

```
python backend/app.py
```

### Step 2: Open login.html in the browser!



