const mongoose = require('../../config/databaseConfig');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fuser-profile&psig=AOvVaw2fKyfXwYmS5ntFVgwcfcnX&ust=1725521939159000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKjFyqXkqIgDFQAAAAAdAAAAABAE'
    },
    associations: [{
        type: Schema.Types.ObjectId,
        ref: 'Association'
    }],
    role: {
        type: String,
        required: true,
        default: 'User'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
