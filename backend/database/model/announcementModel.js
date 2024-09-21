const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    clubId: {type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true},
    date: {type: Date, default: Date.now},
    attachments: [{type: String}],
    isActive: {type: Boolean, default: true},
    createdAt:{type:Date},
    lastUpdatedAt: {type: Date},
    lastUpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;