const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length > 0;
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => user.username === username && user.password === password);
  return validUsers.length > 0;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;

  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Unable to find this ISBN!" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated.` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;

  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }

  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: 'Review successfully deleted' });
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
