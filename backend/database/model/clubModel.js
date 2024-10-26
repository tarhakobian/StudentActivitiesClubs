const mongoose = require('../../config/databaseConfig');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true,
    },
    inputType: {
        type: String, // "text", "single-choice", "multiple-choice"
        required: true,
    },
    choices: [String], // If it's a choice-based question, store possible choices here
});

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
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            role: String
        }
    ],
    imageUrl: {
        type: String,
    },
    application: {
        questions: [questionSchema],
    },
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
