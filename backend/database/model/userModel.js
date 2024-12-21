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

    //Profile
    titleName:{
        type: String,
        default: this.name
    },
    bio:{
        type: String,
        required: false
    },
    profileImageUrl: {
        type: String,
        default: 'https://studentactivitesclubs.nyc3.cdn.digitaloceanspaces.com/6ce296d6-7501-4b6f-9124-6553403d3a45.jpg'
    },
    //
    
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
