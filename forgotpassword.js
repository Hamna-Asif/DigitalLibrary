document.addEventListener('DOMContentLoaded', () => {
  
  const form = document.getElementById('forgotPasswordForm');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const messageDiv = document.getElementById('message');

  const API_URL = 'http://localhost:3000/forgot-password';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const username = localStorage.getItem('username');
    console.log("Username from localStorage:", username);


    if (!newPassword || !confirmPassword) {
      showMessage('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match.');
      return;
    }

    if (!username) {
      showMessage('No username found in local storage.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword })
      });

      const result = await response.json();
      if (result.success) {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to connect to server');
    }
  });

  function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.style.color = type === 'success' ? 'green' : 'red';
  }
});
