const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true,
        match: [/\([0-9]{1,3}\)/, 'Ingresa una llave correcta']
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    }
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
