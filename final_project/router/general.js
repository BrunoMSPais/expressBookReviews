const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || username.trim().length == 0) {
    return res.status(400).send(JSON.stringify({ message: 'username not provided' }, null, 4));
  }

  if (!password || password.trim().length == 0) {
    return res.status(400).send(JSON.stringify({ message: 'password not provided' }, null, 4));
  }

  for(let user of users) {
    if (user.username == username) {
        return res.status(403).send(JSON.stringify({ message: 'Username already exists' }, null, 4));
    }
  }

  users.push({ username, password })

  return res.status(200).send(JSON.stringify({ message: `The user ${username} was added to the users list.` }, null, 4));
});

let getBooks = () =>{
    return new Promise((resolve,reject) => {
        setTimeout(
          resolve({
            message: "Operation was successfull",
            data: books
          }), 250);
    })
}

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const booksAPICall = await getBooks();

  const bookList = booksAPICall.data;

  if (!bookList) {
    return res.status(404).send(JSON.stringify({ message: 'No books found' }, null, 4));
  } else {
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let book = books[isbn];

  if (!book) return res.status(404).send(JSON.stringify({ message: 'Book not found' }, null, 4));

  return res.status(200).send(JSON.stringify({ book }, null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let theAuthor = req.params.author.toLowerCase();

  let bookEntries = Object.entries(books);

  for(let entrie in bookEntries) {
    if (bookEntries[entrie][1].author.toLowerCase().includes(theAuthor)) {
        return res.status(200).send(JSON.stringify(bookEntries[entrie][1], null, 4));
    }
  }

  return res.status(404).send(JSON.stringify('Book not found'), null, 4);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  
    let bookEntries = Object.entries(books);
  
    for(let entrie in bookEntries) {
      if (bookEntries[entrie][1].title.toLowerCase().includes(title.toLowerCase())) {
          return res.status(200).send(JSON.stringify(bookEntries[entrie][1], null, 4));
      }
    }
  
    return res.status(404).send(JSON.stringify({ message: 'Book not found' }, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
  
    let book = books[isbn];
  
    if (!book) return res.status(404).send(JSON.stringify({ message: 'Book not found' }, null, 4));

    let reviews = book.reviews;
  
    return res.status(200).send(JSON.stringify({ reviews }, null, 4));
});

module.exports.general = public_users;
