const mongoose = require('mongoose');
require('mongoose-type-email');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 40,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        maxlength: 40,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    volume:{
        type: Number,
        max: 1,
        min: 0,
        default: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    play_queue: [{
        type: String,
        trim: true,
    }],
    actual_index_song: {
        type: Number
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;