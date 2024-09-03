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
    associations: [{
        type: Schema.Types.ObjectId,
        ref: 'Association'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
