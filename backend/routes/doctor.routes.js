import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticateJWT } from '../middleware/auth.js';
const router = express.Router();

// Get current patient details for a doctor (today's active appointment)
router.get('/current/:doctorId', authenticateJWT, async (req, res) => {
  try {
    const { doctorId } = req.params;
    // find upcoming approved appointment for today for this doctor
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    const appt = await Appointment.findOne({
      doctorId,
      status: 'approved',
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 }).populate('user');
    if(!appt) return res.status(404).json({error:'No current patient found'});
    res.json({ appointment: appt, patient: appt.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({error:err.message});
  }
});

export default router;
