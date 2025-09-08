import express from 'express';
import { getCities, getHospitalsByCity, selectHospital, selectHospitalRegister } from '../controllers/context.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Get distinct list of cities (from hospitals)
router.get('/cities', getCities);

// Get hospitals by city
router.get('/hospitals/:city', getHospitalsByCity);

router.get('/hospitals', selectHospitalRegister);

// Set selected hospital for the logged-in patient
router.post('/select-hospital', authenticateJWT, selectHospital);

export default router;
