let mongoose = require('mongoose');

// Book Schema
let bookSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  bookauthor:{
    type: String,
    required: true
  },
  pagenumber:{
    type: Number,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  status:{
    type: Boolean
  }
});

let Book = module.exports = mongoose.model('Book', bookSchema);


