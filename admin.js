document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submitButton');
  const messageDiv = document.getElementById('message');
  const backButton = document.getElementById('backButton');

  // Correct backend API endpoint
  const API_URL = 'http://localhost:3000/adminlogin';

  // Handle form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showMessage('Please enter both username and password');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    try {
      const response = await loginToApi(username, password);

      if (response.success) {
        showMessage('Login successful! Redirecting...', 'success');
        localStorage.setItem('adminId', response.adminId);

        setTimeout(() => {
          window.location.replace('admin1.html');
        }, 1000);
      } else {
        showMessage(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      showMessage('Unable to connect to the server. Please try again later.');
      console.error('API error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Login';
    }
  });

  // Back button
  backButton.addEventListener('click', () => {
    // if (window.history.length > 1) {
    //   window.history.back();
    // } else {
      window.location.href = 'mainpage.html';
    //}
  });

  // Show message to user
  function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.style.color = type === 'success' ? '#4CAF50' : '#ff3333';
  }

  // API call function
  async function loginToApi(username, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return await response.json();
  }
});
