const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const associationSchema = new Schema({
    club_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default : "Member"
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+@.+\..+/,
    },
    associations: [associationSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
