document.addEventListener("DOMContentLoaded", async () => {
  const resultsContainer = document.getElementById("searchResults");
  const recommendationsContainer = document.getElementById("recommendations").querySelector('.recommendation-list');

  function displayBooks(books) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";
  
    books.forEach(book => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-simple");
  
      const imgSrc = book.image
        ? `data:image/jpeg;base64,${book.image}`
        : 'default-placeholder.jpg'; // <-- fallback image
  
      bookElement.innerHTML = `
        <a href="dashboard2.html?bookId=${book.id}">
          <img src="${imgSrc}" alt="${book.title}" class="book-cover" />
        </a>
        <p class="book-title">${book.title}</p>
      `;
  
      resultsContainer.appendChild(bookElement);
    });
  }

  // Display some recommended books below search results
  function displayRecommendations(books) {
    recommendationsContainer.innerHTML = "";
    books.forEach(book => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-simple");
  
      const imgSrc = book.image
        ? `data:image/jpeg;base64,${book.image}`
        : 'default-placeholder.jpg'; // fallback image
  
      bookElement.innerHTML = `
        <a href="dashboard2.html?bookId=${book.id}">
          <img src="${imgSrc}" alt="${book.title}" class="book-cover" />
        </a>
        <p class="book-title">${book.title}</p>
      `;
  
      recommendationsContainer.appendChild(bookElement);
    });
  }
  

  // Fetch and show all books on load
  async function loadAllBooks() {
    try {
      const res = await fetch('http://localhost:3000/books');
      const books = await res.json();
      //displayBooks(books);
      displayRecommendations(books.slice(0, 5)); // Show first 5 books as recommendations
    } catch (err) {
      console.error("Error loading books:", err);
    }
  }

  window.searchBooks = async function () {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const res = await fetch(`http://localhost:3000/search?q=${query}`);
    const books = await res.json();
    displayBooks(books);
  };

  window.filterGenre = async function (genre) {
    const res = await fetch(`http://localhost:3000/filter?genre=${genre}`);
    const books = await res.json();
    displayBooks(books);
  };

  await loadAllBooks();
});
