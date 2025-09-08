import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  fullName: String,
  fatherName: String, // Not present before
  dob: Date,
  gender: String,
  contactNumber: String,
  email: String,
  address: {
    street: String,
    district: String,
    state: String,
    country: String
  },
  medications: String,
  allergies: String,
  pastConditions: String,
  documents: [String],
  department: String,
  doctor: String,
  date: Date,
  time: String,
  emergency: Boolean,
  hospital: String, // Added
  createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
