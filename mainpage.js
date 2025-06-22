// DOM elements 
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const adminLink = document.getElementById('adminLink');

// Event listeners
loginBtn.addEventListener('click', () => {
  // Open login modal/page
  window.location.href = 'loginpage.html'; // Direct to login HTML page
  console.log('Login button clicked');
});

signupBtn.addEventListener('click', () => {
  // Open signup modal/page
  window.location.href = 'signuppage.html'; // Direct to signup HTML page
  console.log('Signup button clicked');
});

adminLink.addEventListener('click', () => {
  // Open admin login or verification page
  window.location.href = 'admin.html'; // Direct to admin HTML page
  console.log('Admin link clicked');
});

// Login handling function - can be called from login.html
function handleLogin(credentials) {
  // API call implementation
  window.api.login(credentials)
    .then(result => {
      if (result.success) {
        alert('Login successful!');
        window.location.href = 'loginpage.html'; // Navigate to library main page
      } else {
        alert('Login failed: ' + result.message);
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    });
}

// Signup handling function - can be called from signup.html
function handleSignup(userData) {
  // API call implementation
  window.api.signup(userData)
    .then(result => {
      if (result.success) {
        alert('Signup successful! Please login to continue.');
        window.location.href = 'login.html'; // Show login form
      } else {
        alert('Signup failed: ' + result.message);
      }
    })
    .catch(err => {
      console.error('Signup error:', err);
      alert('An error occurred during signup.');
    });
}

// Admin verification function - can be called from admin.html
function checkAdminStatus(userId) {
  // API call implementation
  window.api.checkAdmin(userId)
    .then(result => {
      if (result.isAdmin) {
        alert('Admin access granted!');
        window.location.href = 'admin.html'; // Navigate to admin dashboard
      } else {
        alert('You do not have admin privileges.');
        window.location.href = '.html'; // Return to main page
      }
    })
    .catch(err => {
      console.error('Admin check error:', err);
      alert('An error occurred when checking admin status.');
    });
}