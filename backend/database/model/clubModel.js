const mongoose = require('../../config/databaseConfig');

const Schema = mongoose.Schema;
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
            ref: 'User'
        }
    ],
    imageUrl: {
        type: String,
    },
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
