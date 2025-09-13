// models/SOS.js
const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String, // optional user-friendly address
  },
  message: String, // optional message from user
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who resolved
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('SOS', sosSchema);
