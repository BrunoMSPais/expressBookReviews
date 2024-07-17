const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let isUserFound = users.filter(user => username == user.username).length == 1;

    return isUserFound;
}

const authenticatedUser = (username, password)=>{ //returns boolean
    let user = users.filter(user => username == user.username)[0];

    let isPasswordValid = password == user.password;

    return isPasswordValid;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // Login endpoint
    const { username, password } = req.body;

    if (!username || username.trim().length == 0) {
        return res.status(400).send(JSON.stringify({ message: 'username not provided' }, null, 4));
    }

    if (!password || password.trim().length == 0) {
        return res.status(400).send(JSON.stringify({ message: 'password not provided' }, null, 4));
    }

    let isUserValid = isValid(username);

    let isAuthenticated = authenticatedUser(username, password);

    if (!isUserValid || !isAuthenticated) {
        return res.send(401).send(JSON.stringify({ message: 'Invalid credentials' }, null, 4));
    }

    let user = users.filter(user => username == user.username)[0];

    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken
    }

    return res.status(200).send(JSON.stringify({ message: "User successfully logged in", token: accessToken }, null, 4));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
