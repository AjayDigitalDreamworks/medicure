const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientId: String,
  name: String,
  dob: Date,
  allergies: [String],
  diagnoses: [String],
  medications: [String],
  labResults: [
    {
      testName: String,
      result: Number,
      unit: String,
      referenceRange: String,
      status: String,
    },
  ],
  imagingReports: [
    {
      date: Date,
      type: String,
      summary: String,
      status: String,
    },
  ],
  appointments: [
    {
      date: Date,
      doctor: String,
      department: String,
      status: String,
    },
  ],
  admissions: [
    {
      department: String,
      date: Date,
    },
  ],
  notifications: [String],
  queuePosition: Number,
  bedAssignment: {
    ward: String,
    room: String,
    bedNo: String,
    physician: String,
  },
});


module.exports = mongoose.model("Patient", patientSchema);
