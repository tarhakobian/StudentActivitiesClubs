const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    agenda: {type: String, required: true},
    date: {type: Date, required: true},
    attachments: [{type: String}],
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isActive: {type: Boolean, default: true},
    location: {type: String, required: true},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    clubId: {type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true},
    lastUpdatedAt: {type: Date},
    lastUpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;