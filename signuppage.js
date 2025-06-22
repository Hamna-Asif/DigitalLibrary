document.addEventListener('DOMContentLoaded', () => {
    console.log('Signup page loaded');
    
    const signupForm = document.getElementById('signupForm');
    const gmailInput = document.getElementById('gmail');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const backButton = document.getElementById('backButton');
    const submitButton = document.getElementById('submitButton');
    const loadingSpinner = document.getElementById('loading');
    
    const gmailError = document.getElementById('gmail-error');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // Validation functions
    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(password);
    
    const validateUsername = (username) => /^[a-zA-Z0-9_]{4,}$/.test(username);
    
    // Back button functionality
    backButton.addEventListener('click', () => {
        window.history.back(); // Navigate back to the previous page
    });
    
    // Real-time validation
    const attachValidation = (input, errorEl, validator, emptyMsg, invalidMsg) => {
        input.addEventListener('blur', () => {
            if (!input.value) {
                errorEl.textContent = emptyMsg;
            } else if (!validator(input.value)) {
                errorEl.textContent = invalidMsg;
            } else {
                errorEl.textContent = '';
            }
        });
    };

    attachValidation(gmailInput, gmailError, validateEmail, 'Email is required', 'Invalid Gmail address');
    attachValidation(usernameInput, usernameError, validateUsername, 'Username is required', 'At least 4 characters, alphanumeric');
    attachValidation(passwordInput, passwordError, validatePassword, 'Password is required', '8+ chars, upper, lower, number, symbol');
    
    confirmPasswordInput.addEventListener('blur', () => {
        if (!confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Confirm your password';
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
        } else {
            confirmPasswordError.textContent = '';
        }
    });
    
    // Sign-Up Form Submission
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Clear previous errors
        gmailError.textContent = '';
        usernameError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
    
        let hasErrors = false;

        // Manual validation before sending data
        if (!gmailInput.value || !validateEmail(gmailInput.value)) {
            gmailError.textContent = !gmailInput.value ? 'Email is required' : 'Invalid Gmail address';
            hasErrors = true;
        }
        if (!usernameInput.value || !validateUsername(usernameInput.value)) {
            usernameError.textContent = !usernameInput.value ? 'Username is required' : 'Invalid username';
            hasErrors = true;
        }
        if (!passwordInput.value || !validatePassword(passwordInput.value)) {
            passwordError.textContent = !passwordInput.value ? 'Password is required' : 'Weak password';
            hasErrors = true;
        }
        if (!confirmPasswordInput.value || confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent =  !confirmPasswordInput.value ? 'Confirm your password' : 'Passwords do not match';
            hasErrors = true;
        }

        if (hasErrors) return; // Stop if there are validation errors
        
        // Show loader
        loadingSpinner.classList.remove('hidden');
        submitButton.disabled = true;

        try {
            // Send data to backend
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmail: gmailInput.value,
                    username: usernameInput.value,
                    password: passwordInput.value
                })
            });
            const data = await response.json();
            if (response.ok) {
                loadingSpinner.classList.add('hidden');
                submitButton.disabled = false;
                alert(data.message);
                signupForm.reset();
                localStorage.setItem('userId', data.userId); // Save userId in localStorage
               // window.location.replace('infopage1.html');
              
            } else {
                loadingSpinner.classList.add('hidden');
                submitButton.disabled = false;
                alert(data.message || 'Signup failed');
            }
        } catch (error) {
            loadingSpinner.classList.add('hidden');
            submitButton.disabled = false;
            alert('Signup failed: ' + error.message);
        }
    });

    // Display a success message
    function showSuccess(message) {
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.style.color = '#4CD964';
        msg.style.textAlign = 'center';
        msg.style.marginTop = '15px';
        msg.style.fontWeight = 'bold';
        msg.textContent = message;
        signupForm.appendChild(msg);

        setTimeout(() => msg.remove(), 4000);
    }
});