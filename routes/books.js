const express = require('express');
const router = express.Router();

// Book Model
let Book = require('../models/book');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_book', {
    title:'Add Book'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  //req.checkBody('body','Description is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_book', {
      title:'Add Book',
      errors:errors
    });
  } else {
    let book = new Book();
    book.title = req.body.title;
    book.bookauthor = req.body.bookauthor;
    book.pagenumber = req.body.pagenumber;
    book.author = req.user._id;
    book.body = req.body.body;

    book.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Book Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Book.findById(req.params.id, function(err, book){
    if(book.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_book', {
      title:'Edit Book',
      book:book
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let book = {};
  book.title = req.body.title;
  book.bookauthor = req.body.bookauthor;
  book.pagenumber = req.body.pagenumber;
  book.author = req.body.author;
  book.body = req.body.body;
  // Status botton
  book.status = false;

  let query = {_id:req.params.id}

  Book.update(query, book, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Book Updated');
      res.redirect('/');
    }
  });
});

// Delete Book
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Book.findById(req.params.id, function(err, book){
    if(book.author != req.user._id){
      res.status(500).send();
    } else {
      Book.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Book
router.get('/:id', function(req, res){
  Book.findById(req.params.id, function(err, book){
    User.findById(book.author, function(err, user){
      res.render('book', {
        book:book,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
