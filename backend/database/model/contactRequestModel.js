const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now }
});

contactRequestSchema.pre('save', function (next) {
  this.lastUpdatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);