// Handle user authentication

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store the token in localStorage
                    localStorage.setItem('token', data.token);
                    
                    // Decode token to get user role
                    const tokenData = JSON.parse(atob(data.token.split('.')[1]));
                    const userRole = tokenData.role;
                    
                    // Redirect based on role
                    if (userRole === 'admin') {
                        alert('Logged in as admin');
                        // Could redirect to admin page if created
                    } else {
                        alert('Logged in successfully');
                    }
                    
                    // Redirect to movies page
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Login error. Please try again.');
            }
        });
    }
    
    // Handle register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('role').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        role: role
                    }),
                });
                
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    const data = await response.text();
                    alert('Registration failed: ' + data);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('Registration error. Please try again.');
            }
        });
    }
    
    // Check authentication status and update UI
    function updateAuthUI() {
        const token = localStorage.getItem('token');
        const navItems = document.querySelector('nav ul');
        
        if (token && navItems) {
            // Update nav menu for logged in users
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = decodedToken.role;
            
            // Find login and register links to remove them
            const loginLink = document.querySelector('a[href="login.html"]');
            const registerLink = document.querySelector('a[href="register.html"]');
            
            if (loginLink) {
                loginLink.parentElement.remove();
            }
            
            if (registerLink) {
                registerLink.parentElement.remove();
            }
            
            // Add logout and username display
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = '<a href="#" id="logout-link">Logout</a>';
            navItems.appendChild(logoutItem);
            
            const usernameItem = document.createElement('li');
            usernameItem.innerHTML = `<span class="username">Welcome, ${role}</span>`;
            navItems.appendChild(usernameItem);
            
            // Add admin link if user is admin
            if (role === 'admin') {
                const adminItem = document.createElement('li');
                adminItem.innerHTML = '<a href="admin.html">Admin</a>';
                navItems.insertBefore(adminItem, navItems.firstChild.nextSibling);
            }
            
            // Add event listener for logout
            document.getElementById('logout-link').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    }
    
    // Call updateAuthUI on page load
    updateAuthUI();
});