document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
    const totalEarned = document.getElementById('totalEarned');
    const totalSpent = document.getElementById('totalSpent');
    const netBalance = document.getElementById('netBalance');
    const expenseChart = document.getElementById('expenseChart');

    let transactions = [];
    let earned = 0;
    let spent = 0;
    let chartInstance = null;

    // Fetch transactions from backend
    fetch("http://127.0.0.1:5000/expenses")
        .then(response => response.json())
        .then(data => {
            transactions = data;
            transactions.forEach(updateSummary);
            updateTable();
            updateChart();
        });

    // Handle adding a transaction
    transactionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const transaction = {
            transaction_type: document.getElementById('transaction_type').value,
            amount: parseFloat(document.getElementById('amount').value), // Ensure it's parsed as a float
            transaction_date: document.getElementById('transaction_date').value
        };

        fetch("http://127.0.0.1:5000/add_expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            transactions.push(transaction);
            updateSummary(transaction);
            updateTable();
            updateChart(); // Update chart after adding a transaction
            transactionForm.reset();
        })
        .catch(error => console.error("Error:", error));
    });

    function updateTable() {
        transactionsTable.innerHTML = '';
        transactions.forEach(transaction => {
            // Ensure amount is a number before displaying
            const amount = parseFloat(transaction.amount);
            const formattedAmount = isNaN(amount) ? 0 : amount.toFixed(2); // If not a number, set to 0

            const row = transactionsTable.insertRow();
            row.innerHTML = `
                <td>${transaction.transaction_date}</td>
                <td>${transaction.transaction_type}</td>
                <td>$${formattedAmount}</td> <!-- Ensure 2 decimal places -->
            `;
        });
    }

    function updateSummary(transaction) {
        let amount = parseFloat(transaction.amount); // Ensure the amount is parsed as a number

        // If it's not a valid number, set it to 0
        if (isNaN(amount)) {
            amount = 0;
        }

        if (transaction.transaction_type === "earned") {
            earned += amount;
        } else {
            spent += amount;
        }

        // Display with 2 decimal places
        totalEarned.textContent = `$${earned.toFixed(2)}`;
        totalSpent.textContent = `$${spent.toFixed(2)}`;
        netBalance.textContent = `$${(earned - spent).toFixed(2)}`;
    }

    function updateChart() {
        console.log("Updating chart...");
        console.log("Earned:", earned, "Spent:", spent); // Check the values before updating the chart

        if (chartInstance) {
            chartInstance.destroy(); // Destroy the old chart instance
        }

        // Create the new chart instance
        chartInstance = new Chart(expenseChart, {
            type: "doughnut",
            data: {
                labels: ["Revenue", "Expenses"],
                datasets: [{
                    data: [earned, spent], // Update with dynamic values
                    backgroundColor: ["#4CAF50", "#F44336"]
                }]
            }
        });
    }
});
