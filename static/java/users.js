document.addEventListener("DOMContentLoaded", () => {
    const usersTableBody = document.getElementById("usersTableBody");

    // Get logged-in user's role
    const loggedInUserRole = localStorage.getItem("userRole");

    function fetchUsers() {
        fetch("http://127.0.0.1:5000/get_users")
            .then(response => response.json())
            .then(users => {
                usersTableBody.innerHTML = "";
                users.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        ${loggedInUserRole === "admin" ? `<td><button class="delete-button" data-id="${user.id}">Delete</button></td>` : ""}
                    `;
                    usersTableBody.appendChild(row);
                });

                // Attach delete event listeners (only for admins)
                if (loggedInUserRole === "admin") {
                    document.querySelectorAll(".delete-button").forEach(button => {
                        button.addEventListener("click", function () {
                            const userId = this.getAttribute("data-id");
                            confirmDeleteUser(userId);
                        });
                    });
                }
            });
    }

    // Confirmation before deleting user
    function confirmDeleteUser(userId) {
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            deleteUser(userId);
        }
    }

    // Send DELETE request with admin role verification
    function deleteUser(userId) {
        fetch(`http://127.0.0.1:5000/delete_user/${userId}`, {
            method: "DELETE",
            headers: { "User-Role": localStorage.getItem("userRole") }  // Send role to backend
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchUsers(); // Refresh the user list
        })
        .catch(error => console.error("Error deleting user:", error));
    }

    fetchUsers();
});
  
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");  // Remove user email
    localStorage.removeItem("userRole");  // Remove user role
    alert("You have been logged out!");
    window.location.href = "../templates/login.html";  // Redirect to login page
});
