const express = require('express');
const router = express.Router();
const {
  getDoctorStats,
  getCurrentPatientAndHistory,
  moveToNextPatient,
  getTodaysAppointments,
  addPrescription,
  getPatientHistory,
  getPatientReports,
} = require('../controllers/doctorController');
const { ensureAuthenticated , checkRoles } = require("../config/auth");
const User = require("../models/User");


// router.get('/stats/', getDoctorStats);
// GET /doctor/dashboard
router.get('/dashboard',ensureAuthenticated,checkRoles(['doctor']), (req, res) => {
  res.render('doctor/doctor'); // Just render the EJS, don't send any data yet
});

router.get('/by-department/:department', async (req, res) => {
  try {
    const departmentParam = req.params.department;
    if (!departmentParam) {
      return res.status(400).json({ error: "Department param missing" });
    }

    // Use regex for exact match case-insensitive
    const doctors = await User.find({
      role: 'doctor',
      department: { $regex: new RegExp(`^${departmentParam.trim()}$`, 'i') }
    }).select('name specialization department'); // choose fields you need

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors by department:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/current-patient', getCurrentPatientAndHistory);
router.post('/queue/next', moveToNextPatient);

// ✅ This will now resolve to /api/doctor/stats
router.get('/stats', getDoctorStats);

// ✅ This becomes /api/doctor/appointments/today
router.get('/appointments/today', getTodaysAppointments);

// ✅ This becomes /api/doctor/current-patient
// router.get('/current-patient', getCurrentPatientAndHistory);

// ✅ Move to next patient
router.post('/next-patient', moveToNextPatient);


// router.get('/appointments/today', getTodaysAppointments);

// Write prescription
router.post('/appointments/:appointmentId/prescription', addPrescription);

// View patient history
router.get('/patients/:patientId/history', getPatientHistory);

// View patient reports
router.get('/patients/:patientId/reports', getPatientReports);

module.exports = router;
