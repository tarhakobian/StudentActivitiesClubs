const mongoose = require('../../config/databaseConfig');
const Schema = mongoose.Schema;
const Association = import('./associationModel');

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
    associations: [Association]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
