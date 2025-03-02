const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toRegister = document.getElementById("to-register");
const toLogin = document.getElementById("to-login");
const logoutBtn = document.getElementById("logout-btn");

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
});

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
});

toRegister.addEventListener("click", () => {
    registerTab.click();
});

toLogin.addEventListener("click", () => {
    loginTab.click();
});

// Function to show alert messages
const showMessage = (message, isSuccess = true) => {
    alert(message);
    if (isSuccess) console.log("✅ Success:", message);
    else console.error("❌ Error:", message);
};

// Login Form Submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email.includes("@")) {
        showMessage("Please enter a valid email.", false);
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long.", false);
        return;
    }

    try {
        const response = await fetch("https://ib-cs-hl-ia.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        showMessage(data.message, response.ok);

        if (response.ok) {
            localStorage.setItem("user", email);  // Store email
            localStorage.setItem("userRole", data.role);  // Store user role (admin/user)
            window.location.href = "start.html"; // Redirect to dashboard
        }
    } catch (error) {
        showMessage("Login failed! Please try again.", false);
    }
});

// Register Form Submission
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (name.trim() === "") {
        showMessage("Name cannot be empty.", false);
        return;
    }

    if (!email.includes("@")) {
        showMessage("Please enter a valid email.", false);
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long.", false);
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", false);
        return;
    }

    try {
        const response = await fetch("https://ib-cs-hl-ia.onrender.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        showMessage(data.message, response.ok);

        if (response.ok) {
            loginTab.click(); // Switch to login tab
        }
    } catch (error) {
        showMessage("Registration failed! Please try again.", false);
    }
});

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole"); // Clear role
    showMessage("You have been logged out!");
    window.location.href = "start.html";
});


