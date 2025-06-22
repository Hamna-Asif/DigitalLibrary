const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000; // or any available port

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Fast@s147$56',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Route: Handle signup
app.post('/signup', async (req, res) => {
  const { gmail, username, password } = req.body;

  // Basic validation
  if (!gmail || !username || !password) {
    return res.status(400).json({ message: 'Gmail, username, and password are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table and get the inserted user ID
    const [result] = await pool.query(
      'INSERT INTO users (gmail, username, password) VALUES (?, ?, ?)',
      [gmail, username, hashedPassword]
    );

    // If insert was successful, get the user ID from the result
    if (result.affectedRows > 0) {
      const userId = result.insertId; // MySQL insertId gives the ID of the last inserted row
      res.status(201).json({ message: 'User registered successfully!', userId });
    } else {
      res.status(500).json({ message: 'Failed to create user.' });
    }
  } catch (err) {
    console.error('Signup error:', err); // Shows constraint or syntax errors
    res.status(500).json({ message: 'Signup failed.' });
  }
})

// Route: Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      console.log('Username not found');
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    //res.status(200).json({ success: true, message: 'Login successful' });
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      userId: user.id, 
      username: user.username 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Route: Handle forgot password
app.post('/forgot-password', async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: 'Username and new password are required.' });
  }

  try {
    // Check if user exists
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found with provided username.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
});

// Route: Admin login
app.post('/adminlogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE adminname = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      res.status(200).json({ success: true, message: 'Admin login successful', adminId: admin.id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
});

const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route: Add new book
app.post('/addbook', upload.single('bookImage'), async (req, res) => {
  const { title, author, description, link, category } = req.body;
  const file = req.file;

  if (!title || !author || !description || !link || !category || !file) {
    return res.status(400).json({ success: false, message: 'All fields including image are required.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO books (title, author, description, link, category, image, image_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, author, description, link, category, file.buffer, file.mimetype]
    );

    res.status(201).json({ success: true, message: 'Book added successfully!', bookId: result.insertId });
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ success: false, message: 'Server error while adding book' });
  }
});

app.post('/add-to-reading-list', async (req, res) => {
  const { userId, bookId } = req.body;
  console.log('Loaded apbookId:', bookId);

  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: 'User ID and Book ID are required.' });
  }

  try {
    await pool.query(
      'INSERT IGNORE INTO reading_list (user_id, book_id) VALUES (?, ?)',
      [userId, bookId]
    );
    res.status(200).json({ success: true, message: 'Book added to reading list.' });
  } catch (err) {
    console.error('Add to reading list error:', err);
    res.status(500).json({ success: false, message: 'Server error while adding to reading list.' });
  }
});



app.post('/api/reading-list', async (req, res) => {
  const { userId } = req.body;
  console.log('Loaded userId:', userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: 'UserId is required.' });
  }


  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.title, b.image 
      FROM books b
      JOIN reading_list r ON b.id = r.book_id
      WHERE r.user_id = ?
    `, [userId]);

    // Convert image BLOBs to base64
    const books = rows.map(book => ({
      id: book.id,
      title: book.title,
      image: book.image ? Buffer.from(book.image).toString('base64') : null
    }));

    res.json(books);
  } catch (err) {
    console.error('Error fetching reading list:', err);
    res.status(500).json({ error: 'Failed to fetch reading list' });
  }
});

app.get('/books', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, author, description, link, category, image, image_type FROM books'
    );

    const booksWithBase64Images = rows.map(book => ({
      ...book,
      image: book.image.toString('base64'),  // convert buffer to base64 string
    }));

    res.json(booksWithBase64Images);
  } catch (error) {
    console.error('Fetch books error:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

app.post('/remove-from-reading-list', async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: 'User ID and Book ID are required.' });
  }

  try {
    await pool.query(
      'DELETE FROM reading_list WHERE user_id = ? AND book_id = ?',
      [userId, bookId]
    );
    res.status(200).json({ success: true, message: 'Book removed from reading list.' });
  } catch (err) {
    console.error('Remove from reading list error:', err);
    res.status(500).json({ success: false, message: 'Server error while removing book from reading list.' });
  }
});


app.get('/search', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  try {
    const [books] = await pool.query(
      `SELECT id, title, author, description, link, category, image, image_type 
       FROM books 
       WHERE LOWER(title) LIKE CONCAT('%', ?, '%') 
          OR LOWER(author) LIKE CONCAT('%', ?, '%')`,
      [query, query]
    );

    const booksWithImages = books.map(book => ({
      ...book,
      image: book.image ? book.image.toString('base64') : null,
    }));

    res.status(200).json(booksWithImages);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error during search' });
  }
});

app.get('/filter', async (req, res) => {
  const genre = req.query.genre;

  if (!genre) {
    return res.status(400).json({ message: 'Genre is required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, title, category, description, link, image, image_type FROM books WHERE category = ?',
      [genre]
    );

    const booksWithImages = rows.map(book => ({
      ...book,
      image: book.image.toString('base64'),
    }));

    res.json(booksWithImages);
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Failed to filter books' });
  }
});




async function fetchBooks() {
  const res = await fetch('http://localhost:3000/books');
  return await res.json();
}

async function searchBooks() {
  const query = document.getElementById("searchBar").value.trim().toLowerCase();
  const res = await fetch('http://localhost:3000/search?q=${query}');
  const books = await res.json();
  displayBooks(books);
}

async function filterGenre(genre) {
  const res = await fetch('http://localhost:3000/filter?genre=${genre}');
  const books = await res.json();
  displayBooks(books);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

