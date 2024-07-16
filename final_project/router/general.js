const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || username.trim().length == 0) {
    return res.status(400).json({ message: 'username not provided'});
  }

  if (!password || password.trim().length == 0) {
    return res.status(400).json({ message: 'password not provided'});
  }

  for(let user of users) {
    if (user.username == username) {
        return res.status(403).json({ message: 'Invalid already exists'});
    }
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (!books) {
    return res.status(404).json({message: 'No books found'});
  } else {
    return res.status(200).json(books);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let book = books[isbn];

  if (!book) return res.status(404).json({ message: 'Book not found' });

  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let theAuthor = req.params.author.toLowerCase();

  let bookEntries = Object.entries(books);

  for(let entrie in bookEntries) {
    if (bookEntries[entrie][1].author.toLowerCase().includes(theAuthor)) {
        return res.status(200).json(bookEntries[entrie][1]);
    }
  }

  return res.status(404).json('Book not found');
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  
    let bookEntries = Object.entries(books);
  
    for(let entrie in bookEntries) {
      if (bookEntries[entrie][1].title.toLowerCase().includes(title.toLowerCase())) {
          return res.status(200).json(bookEntries[entrie][1]);
      }
    }
  
    return res.status(404).json('Book not found');
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
  
    let book = books[isbn];
  
    if (!book) return res.status(404).json({ message: 'Book not found' });

    let reviews = book.reviews;
  
    return res.status(200).json(reviews);
});

module.exports.general = public_users;
