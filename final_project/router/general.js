const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBookList()
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(500).json({message: err}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getBookByAuthor(author)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({message: err}));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getBookByTitle(title)
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}));
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    if (Object.keys(reviews).length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({message: "No reviews found for this book"});
    }
  } else {
    res.status(404).json({message: "Book with this ISBN not found"});
  }
});

// Function to get the book list
function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Function to get all books with a delay
function getAllBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);
  });
}

// Function to get book by ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (!book) {
        reject("Book not found");
      } else {
        resolve(book);
      }
    }, 2000);
  });
}

// Function to get books by author
function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length === 0) {
        reject("Book not found");
      } else {
        resolve(booksByAuthor);
      }
    }, 2000);
  });
}

// Function to get book by title
function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle[0]);
      } else {
        reject("Book not found");
      }
    }, 2000);
  });
}

module.exports.general = public_users;
