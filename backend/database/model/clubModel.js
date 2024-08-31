const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');

const clubSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    cabinet: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    imageUrl: {
        type: String,
        required: true,
    },
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
