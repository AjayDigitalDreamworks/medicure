import express from 'express';
import multer from 'multer';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import { authenticateJWT } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/reports/' });

// Upload report for a patient (doctor or admin)
router.post('/upload/:patientId', authenticateJWT, upload.single('report'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const file = req.file;
    if(!file) return res.status(400).json({error:'Report file required'});
    const patient = await Patient.findById(patientId);
    if(!patient) return res.status(404).json({error:'Patient not found'});

    // append report to patient.reports array
    patient.reports = patient.reports || [];
    patient.reports.push({
      filename: file.filename,
      originalname: file.originalname,
      uploadedBy: req.user && req.user._id ? req.user._id : null,
      uploadedAt: new Date(),
      approved: false
    });
    await patient.save();

    // Notify admin for approval (simple email)
    const admins = await (await import('../models/User.js')).User.find({ role: 'admin' });
    for(const a of admins){
      sendEmail(a.email, 'New report uploaded', `<p>Report for ${patient.name} uploaded. Approve from admin panel.</p>`);
    }

    res.json({message:'Report uploaded, pending approval'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'Upload failed', details: err.message});
  }
});

// Approve appointment (admin)
router.post('/appointment/:id/approve', authenticateJWT, async (req, res) => {
  try {
    if(!req.user || req.user.role !== 'admin') return res.status(403).json({error:'Admin only'});
    const appt = await Appointment.findById(req.params.id).populate('user doctorId');
    if(!appt) return res.status(404).json({error:'Appointment not found'});
    appt.status = 'approved';
    await appt.save();

    // notify patient
    const to = appt.user?.email || appt.contact;
    if(to){
      sendEmail(to, 'Appointment approved', `<p>Your appointment on ${appt.date} at ${appt.time} is approved.</p>`);
    }
    res.json({message:'Appointment approved'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:err.message});
  }
});

export default router;
