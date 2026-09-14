const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matches = Object.keys(books)
    .filter(isbn => books[isbn].author === author)
    .reduce((acc, isbn) => { acc[isbn] = books[isbn]; return acc; }, {});

  if (Object.keys(matches).length > 0) {
    return res.send(JSON.stringify(matches, null, 4));
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matches = Object.keys(books)
    .filter(isbn => books[isbn].title === title)
    .reduce((acc, isbn) => { acc[isbn] = books[isbn]; return acc; }, {});

  if (Object.keys(matches).length > 0) {
    return res.send(JSON.stringify(matches, null, 4));
  }
  return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// ---- Task 11-13: same lookups using Promises / async-await with Axios ----

public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book list", error: err.message });
  }
});

public_users.get('/async/isbn/:isbn', function (req, res) {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(404).json({ message: "Book not found", error: err.message }));
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    res.send(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this author", error: err.message });
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    res.send(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found with this title", error: err.message });
  }
});

module.exports.general = public_users;
