document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("bookId");

  if (!bookId) {
    alert("❌ No book selected.");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/books');
    const books = await res.json();

    const book = books.find(b => b.id == bookId);
    if (!book) {
      alert("❌ Book not found.");
      return;
    }

    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookImage").src = book.image.startsWith("http")
      ? book.image
      : `data:image/jpeg;base64,${book.image}`;
    document.getElementById("bookDescription").textContent = book.description;
    document.getElementById("downloadLink").href = book.link;

    // 🔽 Delete from reading list
    document.getElementById("addToListBtn").addEventListener("click", async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("❌ No user logged in.");
        return;
      }

      try {
    
        const addRes = await fetch("http://localhost:3000/add-to-reading-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, bookId }),
        });
    
        const data = await addRes.json();
    
        if (addRes.ok && data.success) {
          alert("✅ Book added to your reading list.");
        } else {
          alert("❌ " + (data.message || "Failed to add book."));
        }
      } catch (err) {
        console.error("Add error:", err);
        alert("❌ Server error while adding book.");
      }
    });

  } catch (error) {
    console.error("Failed to load book:", error);
  }
});
