const mongoose = require('mongoose');
const queueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  status: { type: String, enum: ['waiting', 'in-progress', 'completed'], required: true },
  priority: { type: String, enum: ['normal', 'urgent'], required: true },
  waitTime: { type: String, required: true },
  position: { type: Number, required: true }
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  current: { type: Number, required: true },
  waiting: { type: Number, required: true },
  avgWait: { type: String, required: true }
});
module.exports = mongoose.model('Queue', queueSchema);
const Department = mongoose.model('Department', departmentSchema);

module.exports = Department ;