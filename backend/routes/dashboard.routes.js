import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getPatientDashboard,
  getDoctorDashboard,
  getAdminDashboard
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// Route for all users - role-based branching
router.get('/', authenticateJWT, async (req, res) => {
  const role = req.user.role;
  console.log("user role after", role);

  if (role === 'patient') {
    console.log("inside patient");
    return getPatientDashboard(req, res);
  } else if (role === 'doctor') {
    console.log("inside doctor");
    return getDoctorDashboard(req, res);
  } else if (role === 'admin') {
    console.log("inside admin");
    return getAdminDashboard(req, res);
  } else {
    return res.status(403).json({ error: 'Unauthorized role' });
  }
});

export default router;
