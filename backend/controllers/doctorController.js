const Queue = require('../models/Opd');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const User = require('../models/User');
const sendEmail = require('../util/sendEmail');


exports.getDoctorStats = async (req, res) => {
  try {
    const doctorId = '68c54a9ba995c11eb8a6efa3';
    console.log(doctorId);

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });

    const todaysAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const prescriptionsGiven = await Appointment.countDocuments({
      doctor: doctorId,
      prescription: { $ne: '' },
    });

    const totalReports = await Report.countDocuments({ doctor: doctorId });

    const appointments = await Appointment.find({ doctor: doctorId });
    let avgTime = 0;

    if (appointments.length > 0) {
      const totalTime = appointments.reduce((sum, appt) => {
        const diff = (new Date(appt.updatedAt) - new Date(appt.createdAt)) / 60000;
        return sum + diff;
      }, 0);
      avgTime = (totalTime / appointments.length).toFixed(2);
    }

    res.render('doctor/doctor',{
      message: 'Doctor dashboard stats fetched',
      stats: {
        totalAppointments,
        todaysAppointments,
        prescriptionsGiven,
        totalReports,
        averageConsultationTime: `${avgTime} min`,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

exports.getCurrentPatientAndHistory = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const currentQueue = await Queue.findOne({
      doctor: doctorId,
      status: 'in-progress',
    }).populate('patient appointment');

    if (!currentQueue) {
      return res.json({ message: 'No current patient in progress', currentPatient: null });
    }

    const patient = currentQueue.patient;

    const pastAppointments = await Appointment.find({
      patient: patient._id,
      doctor: doctorId,
      status: 'completed'
    }).sort({ date: -1 });

    res.json({
      currentPatient: {
        name: patient.name,
        gender: patient.gender,
        age: patient.age,
        phone: patient.phoneNumber,
        appointment: currentQueue.appointment,
        reports: patient.reports || [],
      },
      pastAppointments,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

exports.moveToNextPatient = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // 1. Complete the current patient
    const current = await Queue.findOne({
      doctor: doctorId,
      status: 'in-progress',
    });

    if (current) {
      current.status = 'completed';
      current.completedAt = new Date();
      await current.save();
    }

    // 2. Get next patient in line
    const next = await Queue.findOne({
      doctor: doctorId,
      status: 'waiting',
    }).sort({ createdAt: 1 }).populate('patient');

    if (!next) {
      return res.status(200).json({ message: 'Queue is empty. No next patient.', nextPatient: null });
    }

    // 3. Mark next patient as in-progress
    next.status = 'in-progress';
    next.startedAt = new Date();
    await next.save();

    // 4. Notify next patient
    const msg = `Dear ${next.patient.name}, your appointment has started. Please proceed to the doctor.`;

    if (next.patient.email) {
      await sendEmail(next.patient.email, 'Your Appointment Has Started', `<p>${msg}</p>`);
    }
    if (next.patient.phoneNumber) {
      await sendSMS(next.patient.phoneNumber, msg);
    }

    // 5. Return next patient info
    res.status(200).json({
      message: 'Moved to next patient',
      nextPatient: {
        name: next.patient.name,
        age: next.patient.age,
        gender: next.patient.gender,
        phone: next.patient.phoneNumber,
        appointmentId: next.appointment,
        queueId: next._id,
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to move to next patient', error: err.message });
  }
};

// 1️⃣ View today's appointments
exports.getTodaysAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: start, $lte: end },
      status: { $in: ['approved', 'in-progress'] }
    }).populate('patient', 'name gender age phoneNumber');

    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
};

// 2️⃣ Write prescription
exports.addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { prescription } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (String(appointment.doctor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.prescription = prescription;
    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({ message: 'Prescription saved', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add prescription', error: err.message });
  }
};

// 3️⃣ View patient history
exports.getPatientHistory = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const patientId = req.params.patientId;

    const history = await Appointment.find({
      doctor: doctorId,
      patient: patientId,
      status: 'completed'
    }).sort({ date: -1 });

    res.status(200).json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

// 4️⃣ View reports uploaded by this patient
exports.getPatientReports = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const reports = await Report.find({ uploadedBy: patientId }).sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};


