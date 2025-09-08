import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: String, // or ref if needed
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: String,
  date: Date,
  name: String,
  address: String,
  contact: String,
  idProof: String, // path to uploaded ID proof
  reason: String,
  time: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'rescheduled', 'cancelled', 'delayed'],
    default: 'pending'
  },
  // ✅ this is required for populate to work
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Check if model already exists, else create it
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
