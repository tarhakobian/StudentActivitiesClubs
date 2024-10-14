const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    agenda: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    attachments: [{ type: String }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    lastUpdatedAt: { type: Date },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


meetingSchema.pre('save', function (next) {
    this.lastUpdatedAt = Date.now();
    next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;