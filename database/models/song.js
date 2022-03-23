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
        default: undefined
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
        // Restricciones añadidas en pre
        // maxlength: 5,
        // match: [/^[0-9]{0,5}$|^[0-9]{1,2}\/[0-9]{1,2}$/, 'Por favor ingresa un formato de número de canción del album valido']
    },
    image: {
        type: subSchemaImage,
    },
    available: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favorite: {
        type: Boolean,
        default: false,
    }
});

SongSchema.pre('save', function (next) {
    // Restriccion de longitud y formato de numeros n ó n/N
    if (String(this.trackNumber).length > 5 || !/^([0-9]{0,5}|[0-9]{1,3}\/[0-9]{1}|[0-9]{2}\/[0-9]{2}|[0-9]{1}\/[0-9]{1,3})$/.test(this.trackNumber))
        this.trackNumber = '';
    next();
});

SongSchema.pre('findOneAndUpdate', function (next) {
    // Restriccion de longitud y formato de numeros n ó n/N
    if (String(this.getUpdate().$set.trackNumber).length > 5 || !/^([0-9]{0,5}|[0-9]{1,3}\/[0-9]{1}|[0-9]{2}\/[0-9]{2}|[0-9]{1}\/[0-9]{1,3})$/.test(this.getUpdate().$set.trackNumber))
        this.getUpdate().$set.trackNumber = '';
    next();
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;