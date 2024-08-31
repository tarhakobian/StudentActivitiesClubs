const mongoose = require('../../config/databaseConfig');

const Schema = mongoose.Schema;
const associationSchema = new Schema({
    club_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "Member"
    },
});

const Association = mongoose.model('Association', associationSchema);

module.exports = Association;

