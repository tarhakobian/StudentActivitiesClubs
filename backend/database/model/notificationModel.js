const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'Club' },
    message: { type: String, required: true },
    entityType: {
        type: String,
        enum: ['Announcement', 'Meeting', 'ContactRequest'],
        required: true
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification