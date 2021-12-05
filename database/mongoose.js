const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://127.0.0.1:27017/taskmanagerdb',{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connect('mongodb://127.0.0.1:27017/songsdb')
    .then(() => {
        console.log('DB connected OK');
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = mongoose