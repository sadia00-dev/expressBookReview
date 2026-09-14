const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: `Review for ISBN ${isbn} has been added/updated`,
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review by this user to delete" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
