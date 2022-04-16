'use strict'
const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

mongoose.connect(config.get('conDatabase'))
    .then(() => {
        console.log('DB connected OK');
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = mongoose;