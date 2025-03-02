document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const orderHistory = document.getElementById('order-history');

    // Fetch orders from backend
    fetch("https://ib-cs-hl-ia.onrender.com/orders")
        .then(response => response.json())
        .then(orders => {
            orders.forEach(addOrderToHistory);
        });

    // Handle adding an order
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const order = {
            name: document.getElementById('name').value,
            quantity: document.getElementById('quantity').value,
            cost: document.getElementById('cost').value,
            email: document.getElementById('email').value,
            order_date: document.getElementById('order_date').value,
            delivery_location: document.getElementById('delivery_location').value
        };

        fetch("https://ib-cs-hl-ia.onrender.com/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            addOrderToHistory(order);
            orderForm.reset();
        })
        .catch(error => console.error("Error:", error));
    });

    function addOrderToHistory(order) {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <h4>${order.name}</h4>
            <p>Quantity: ${order.quantity}</p>
            <p>Cost: $${order.cost}</p>
            <p>Email: ${order.email}</p>
            <p>Date: ${order.order_date}</p>
            <p>Location: ${order.delivery_location}</p>
        `;

        orderHistory.appendChild(orderCard);
    }
});
