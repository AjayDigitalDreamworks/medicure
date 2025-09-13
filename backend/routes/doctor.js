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


router.get('/dashboard/', getDoctorStats);
router.get('/dashboard/current-patient', getCurrentPatientAndHistory);
router.post('/queue/next', moveToNextPatient);

router.get('/appointments/today', getTodaysAppointments);

// Write prescription
router.post('/appointments/:appointmentId/prescription', addPrescription);

// View patient history
router.get('/patients/:patientId/history', getPatientHistory);

// View patient reports
router.get('/patients/:patientId/reports', getPatientReports);

module.exports = router;
