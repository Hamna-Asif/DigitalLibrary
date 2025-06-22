// renderer.js - Handles the UI logic
// Book data storage (would typically connect to a database)
const bookDatabase = [];

// DOM Elements
const photoContainer = document.getElementById('book-photo-container');
const fileInput = document.getElementById('file-input');
const photoPlaceholder = document.getElementById('photo-placeholder');
const descriptionInput = document.getElementById('description');
const authorInput = document.getElementById('author');
const titleInput = document.getElementById('title');
const linkInput = document.getElementById('link');
const categoryInput = document.getElementById('category');
const addBookBtn = document.getElementById('add-book-btn');
const backBtn = document.querySelector('.back-button');
const successMessage = document.getElementById('success-message');

// Error message elements
const photoError = document.getElementById('photo-error');
const descriptionError = document.getElementById('description-error');
const authorError = document.getElementById('author-error');
const titleError = document.getElementById('title-error');
const linkError = document.getElementById('link-error');
const categoryError = document.getElementById('category-error');

// Current book image data
let currentBookImage = null;

// Event Listeners
photoContainer.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      photoPlaceholder.style.display = 'none';
      
      // Remove any existing image
      const existingImg = photoContainer.querySelector('img');
      if (existingImg) {
        photoContainer.removeChild(existingImg);
      }
      
      // Create and add new image
      const img = document.createElement('img');
      img.src = event.target.result;
      photoContainer.appendChild(img);
      
      // Store image data
      currentBookImage = event.target.result;
      
      // Clear error if exists
      photoError.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Back button functionality
backBtn.addEventListener('click', () => {
  // Navigate to admin.html
  window.location.href = 'admin.html';
});

// Add book button functionality
addBookBtn.addEventListener('click', () => {
  // Reset error messages
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(elem => elem.style.display = 'none');
  
  // Validate inputs
  let isValid = true;
  
  if (!currentBookImage) {
    photoError.style.display = 'block';
    isValid = false;
  }
  
  if (!descriptionInput.value.trim()) {
    descriptionError.style.display = 'block';
    isValid = false;
  }
  
  if (!authorInput.value.trim()) {
    authorError.style.display = 'block';
    isValid = false;
  }
  
  if (!titleInput.value.trim()) {
    titleError.style.display = 'block';
    isValid = false;
  }
  
  if (!linkInput.value.trim()) {
    linkError.style.display = 'block';
    isValid = false;
  }
  
  if (!categoryInput.value.trim()) {
    categoryError.style.display = 'block';
    isValid = false;
  }
  
  // If validation passes, add book to database
  if (isValid) {
    const newBook = {
      image: currentBookImage, // base64
      description: descriptionInput.value.trim(),
      author: authorInput.value.trim(),
      title: titleInput.value.trim(),
      link: linkInput.value.trim(),
      category: categoryInput.value.trim()
    };
  
    const formData = new FormData();
formData.append('title', newBook.title);
formData.append('author', newBook.author);
formData.append('description', newBook.description);
formData.append('link', newBook.link);
formData.append('category', newBook.category);

// Convert base64 back to Blob
function base64ToBlob(base64, type = 'image/jpeg') {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
}

const blob = base64ToBlob(currentBookImage);
formData.append('bookImage', blob, 'book.jpg');

fetch('http://localhost:3000/addbook', {
  method: 'POST',
  body: formData
})

    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add book');
      }
      return response.json();
    })
    .then(data => {
      console.log('Server response:', data);
  
      // Show success message
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 3000);
  
      // Reset form
      resetForm();
    })
    .catch(error => {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    });
  }
  
  
});

function resetForm() {
  // Clear all inputs
  currentBookImage = null;
  const existingImg = photoContainer.querySelector('img');
  if (existingImg) {
    photoContainer.removeChild(existingImg);
  }
  photoPlaceholder.style.display = 'block';
  
  descriptionInput.value = '';
  authorInput.value = '';
  titleInput.value = '';
  linkInput.value = '';
  categoryInput.value = '';
  fileInput.value = '';
}