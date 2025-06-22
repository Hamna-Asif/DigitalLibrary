window.onload = async function () {
  try {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }

    document.getElementById("welcome").innerText = `Welcome, ${username}`;

    const API_URL = 'http://localhost:3000/api/reading-list';

    const listRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    console.log('Fetch response status:', listRes.status);

    const books = await listRes.json();
    console.log('API response:', books); // Fixed here

    const grid = document.getElementById("bookGrid");

    books.forEach(book => {
      const imgSrc = book.image
        ? `data:image/jpeg;base64,${book.image}`
        : 'default-placeholder.jpg';

      const item = document.createElement("div");
      item.className = "book-item";
      item.innerHTML = `
        <a href="dashboard3.html?bookId=${book.id}" style="text-decoration: none; color: inherit; text-align: center;">
          <img src="${imgSrc}" alt="${book.title}" />
          <span>${book.title}</span>
        </a>
      `;
      grid.appendChild(item);
    });

  } catch (err) {
    console.error("Error loading reading list", err);
  }
};
