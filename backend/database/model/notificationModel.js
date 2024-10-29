const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId,ref: 'User' },
    sender: { type: Schema.Types.ObjectId },
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