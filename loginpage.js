document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submitButton');
  const messageDiv = document.getElementById('message');
  const backButton = document.getElementById('backButton');
  const forgotpasswordLink = document.getElementById('forgotpasswordLink');
  backButton.addEventListener('click', () => {
    window.location.href = 'mainpage.html';
  });

  const API_URL = 'http://localhost:3000/login'; // ← Corrected API URL

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showMessage('Please enter both username and password');
      return;
    }

    // Store the username in localStorage
    //localStorage.setItem('lastUsername', username);

    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    try {
      const response = await loginToApi(username, password);

      if (response.success) {
        // Store userId and username in localStorage
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('username', response.username);
      
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'search.html';
        }, 1000);
      }
       else {
        showMessage(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      showMessage('Unable to connect to the server. Please try again later.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'SUBMIT';
    }
  });

  backButton.addEventListener('click', () => {
    // if (window.history.length > 1) {
    //   window.history.back();
    // } else {
      window.location.href = 'mainpage.html';
    //}
  });

  forgotpasswordLink.addEventListener('click', () => {
    window.location.href = 'forgotpassword.html';
    console.log('forgotpassword link clicked');
  });

  function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.style.color = type === 'success' ? '#4CAF50' : '#ff3333';
  }

  async function loginToApi(username, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    return await response.json();
  }
});