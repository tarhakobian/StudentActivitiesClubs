const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    attachments: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    lastUpdatedAt: { type: Date },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

announcementSchema.pre('save', function (next) {
    this.lastUpdatedAt = Date.now();
    next();
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;