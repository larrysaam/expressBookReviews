const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
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

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.body.isbn
    const username =  req.session.authorization['username']

    let review =[]
    review = books[isbn].reviews

    if(review.length>0){
        review.forEach(userreview => {
            if( username === userreview.username ){
                userreview = {"username": username, "review": req.reviewNote };
                review = userreview
                books[isbn].review = review 
                res.send("review edited successfully")
            }else{
                userreview = {"username": username, "review": req.reviewNote };
                review = userreview
                books[isbn].review = review 
                res.send("review submitted successfully")
            }
        })
        
    }else{
        books[isbn].reviews = {"username": username, "review": req.reviewNote }
        res.send("review submitted successfully")
    }


});


//  delete review based on sessions username
regd_users.delete('/auth/review/:isbn',function (req, res) {
    const username = req.session.authorization['username']
    const isbn = req.body.isbn

    let userreview = []
    userreview = books[isbn].reviews

    userreview.forEach((review) =>{
        if(review.username === username){
            review = {}
            res.send("review deleted successfully.")
        }else{
            res.send("review deleted successfully..")
        }
    })

    res.send("review deleted successfully...")

    
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
