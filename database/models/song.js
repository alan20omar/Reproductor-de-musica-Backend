const mongoose = require('mongoose');

const subSchemaType = new mongoose.Schema({
    id: {
        type: Number,
        default: 3,
    },
    name: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'front cover',
        maxlength: 20
    }
}, { _id: false });

const subSchemaImage = new mongoose.Schema({
    mime: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/image\/(png|jpeg|jpg)/, 'Por favor ingresa un tipo de imagen valido'],
    },
    type: {
        type: subSchemaType,
        default: { id: 3, name: 'front cover' }
    },
    description: {
        type: String,
        trim: true,
        maxlength: 100,
        default: 'Undefined'
    },
    imageBuffer: {
        type: Buffer,
        required: true
    }
}, { _id: false });

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 60,
        required: true
    },
    artist: {
        type: String,
        trim: true,
        default: 'Unknown',
        maxlength: 60
    },
    album: {
        type: String,
        trim: true,
        default: 'Unknown',
        maxlength: 60
    },
    genre: {
        type: String,
        trim: true,
        default: 'Other',
        maxlength: 30
    },
    trackNumber: {
        type: String,
        trim: true,
        default: '',
        maxlength: 4
    },
    image: {
        type: subSchemaImage,
    },
    avalible: {
        type: Boolean,
        default: true,
    }
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;