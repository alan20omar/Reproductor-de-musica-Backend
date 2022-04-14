'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://127.0.0.1:27017/songsdb')
mongoose.connect('mongodb+srv://alan:alan@cluster0.0sqmi.mongodb.net/songsdb?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB connected OK');
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = mongoose