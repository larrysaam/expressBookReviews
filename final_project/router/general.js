const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
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
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books))
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.body.isbn
    let selectedBook = books[isbn]

    res.send(JSON.stringify(selectedBook))
 });
  
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.body.isbn
    let valueArray = books[isbn];

    res.send(JSON.stringify(valueArray.reviews))

    
});



//use aync await to get books

const getbookdetailFromisbn = (url, isbn)=>{
  const req = axios.get(url + isbn);
  console.log(req);
  req.then(resp => {
      let listofBooks = resp.data;
      listofBooks.forEach((entry)=>{
        console.log(entry);
      });
    })
  .catch(err => {
      console.log(err.toString())
  });
}



const connectToURL = (url)=>{
  const req = axios.get(url);
  console.log(req);
  req.then(resp => {
      let listofBooks = resp.data;
      listofBooks.forEach((entry)=>{
        console.log(entry);
      });
    })
  .catch(err => {
      console.log(err.toString())
  });
}


const getbookdetailFromauthor = (url, author)=>{
  const req = axios.get(url + author);
  console.log(req);
  req.then(resp => {
      let listofBooks = resp.data;
      listofBooks.forEach((entry)=>{
        console.log(entry);
      });
    })
  .catch(err => {
      console.log(err.toString())
  });
}



const getbookdetailFromTitle = (url, title)=>{
  const req = axios.get(url + title);
  console.log(req);
  req.then(resp => {
      let listofBooks = resp.data;
      listofBooks.forEach((entry)=>{
        console.log(entry);
      });
    })
  .catch(err => {
      console.log(err.toString())
  });
}






module.exports.general = public_users;
