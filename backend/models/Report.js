const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional direct link to doctor

  reportUrl: String,
  fileType: String,
  publicId: String,

  title: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
