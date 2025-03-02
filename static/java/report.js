document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const totalEarnedReport = document.getElementById('totalEarnedReport');
    const totalSpentReport = document.getElementById('totalSpentReport');
    const totalOrders = document.getElementById('totalOrders');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const downloadReportBtn = document.getElementById('downloadReportBtn');

    let earned = 0;
    let spent = 0;
    let totalOrderCount = 0;
    let productsData = {};

    // Fetch orders data from Flask backend
    fetch("https://ib-cs-hl-ia.onrender.com/orders")
        .then(response => response.json())
        .then(orders => {
            orders.forEach(order => {
                const product = order.name;
                const cost = parseFloat(order.cost);
                const quantity = parseInt(order.quantity);

                totalOrderCount += quantity;

                // Track product details
                if (!productsData[product]) {
                    productsData[product] = { totalSpent: 0, orderCount: 0 };
                }

                productsData[product].totalSpent += cost;
                productsData[product].orderCount += quantity;
            });

            // Populate the product table
            productTable.innerHTML = "";
            Object.keys(productsData).forEach(product => {
                const row = productTable.insertRow();
                row.innerHTML = `
                    <td>${product}</td>
                    <td>$${productsData[product].totalSpent.toFixed(2)}</td>
                    <td>${productsData[product].orderCount}</td>
                `;
            });

            // Update total orders count
            totalOrders.textContent = totalOrderCount;
        })
        .catch(error => console.error("Error fetching orders:", error));

    // Fetch expenses data from Flask backend
    fetch("https://ib-cs-hl-ia.onrender.com/expenses")
        .then(response => response.json())
        .then(transactions => {
            transactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount);

                if (transaction.transaction_type === "earned") {
                    earned += amount;
                } else if (transaction.transaction_type === "spent") {
                    spent += amount;
                }
            });

            // Update earnings and spending reports
            totalEarnedReport.textContent = `$${earned.toFixed(2)}`;
            totalSpentReport.textContent = `$${spent.toFixed(2)}`;
        })
        .catch(error => console.error("Error fetching expenses:", error));

    // Download report functionality
    downloadReportBtn.addEventListener("click", () => {
        const reportContent = generateReport();
        downloadCSV(reportContent, "CTBX_Report.csv");
    });

    // Function to generate CSV content
    function generateReport() {
        let csvContent = "Product,Amount Spent,Orders\n";

        // Add product data to CSV
        Object.keys(productsData).forEach(product => {
            const productData = productsData[product];
            csvContent += `${product},$${productData.totalSpent.toFixed(2)},${productData.orderCount}\n`;
        });

        csvContent += `\nTotal Earned,$${earned.toFixed(2)}\n`;
        csvContent += `Total Spent,$${spent.toFixed(2)}\n`;
        csvContent += `Total Orders,${totalOrderCount}\n`;

        return csvContent;
    }

    // Function to download CSV file
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
});
