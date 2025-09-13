const mongoose = require("mongoose");

// models/Appointment.js
const appointmentSchema = new mongoose.Schema({
  patient: {
    name: String,
    id: String
  },
  doctor: String,
  department: String,
  date: String,
  time: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  // remove user if not needed OR make it optional
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});


module.exports = mongoose.model("Appointment", appointmentSchema);
