const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
// const axios = require('axios');
const public_users = express.Router();

const doesExist = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


//routes are found below

public_users.post("/register", (req,res) => {
    const username = req.body.username;
     const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', fun0 );


// Get book details based on ISBN
public_users.get('/isbn/:isbn', fun1);
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.body.author
    let key = books.key
    let valueArray = [];

    for (key in books){
        valueArray[key] = books[key] 
    }

    valueArray.forEach(value => {
        if(value.author === author){
            res.send(JSON.stringify(value))
        }
    })

    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.body.title
    let key = books.key
    let valueArray = [];

    for (key in books){
        valueArray[key] = books[key] 
    }

    valueArray.forEach(value => {
        if(value.title === title){
            res.send(JSON.stringify(value))
        }
    })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.body.isbn
    let valueArray = books[isbn];

    res.send(JSON.stringify(valueArray.reviews))

    
});



//using aync await to implement general routes
//get all books
async function fun0(req, res){
    res.send(JSON.stringify(books))
}


//get books by isbn
async function fun1(req, res){

    const isbn = await ( req.body.isbn )
    let selectedBook = books[isbn]

    res.send(JSON.stringify(selectedBook))
}


  //search book by author
  async function fun2(req, res){

    const author = await (req.body.author);
    let key = books.key;
    let valueArray = [];

    for (key in books){
        valueArray[key] = books[key];
    }

    valueArray.forEach(value => {
        if(value.author === author){
            res.send(JSON.stringify(value));
        }
    })

  }


  // search by title
  async function fun3(req, res){

    const title = await (req.body.title)
    let key = books.key
    let valueArray = [];

    for (key in books){
        valueArray[key] = books[key] 
    }

    valueArray.forEach(value => {
        if(value.title === title){
            res.send(JSON.stringify(value))
        }
    })
  }




module.exports.general = public_users;
