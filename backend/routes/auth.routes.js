import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, ROLES } from '../models/User.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// JWT cookie options
const jwtOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000
};


// router.get("/register-patient", (req,res) => {
//     res.render('register', {message: " "});
// })

// router.get("/login", (req,res) => {
//     res.render('index', {message: " "});
// })

// -------------------------------
// ✅ Register Patient
// -------------------------------



router.post('/register-patient', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log(req.body);

    if (!name || !email || !password) {
  return res.status(400).json({ error: 'Missing required fields' });
}

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = await User.registerPatient({ name, email, password, phone });

    // res.status(201).json({ message: 'Patient registered successfully' });
    res.render('register', {message: "registered successfully"});
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' , error: err.message });
  }
});

// -------------------------------
// ✅ Register Doctor
// -------------------------------
router.post('/register-doctor', async (req, res) => {
  try {
    const { name, email, password, phone, doctorProfile } = req.body;

    // Basic validation
    if (!doctorProfile) {
      return res.status(400).json({ error: 'Doctor profile is required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newDoctor = new User({
      name,
      email,
      passwordHash,
      role: 'doctor',
      status: 'pending',
      doctorProfile // ✅ Pass the profile here
    });

    if (phone) newDoctor.phone = phone;

    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    console.error('Doctor register error:', err);
    res.status(500).json({ error: 'Doctor registration failed', details: err.message });
  }
});


// -------------------------------
// ✅ Register Admin
// -------------------------------
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, phone, hospital } = req.body;

    if (!hospital) {
      return res.status(400).json({ error: 'Hospital ID is required for admin' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newAdmin = new User({
      name,
      email,
      passwordHash,
      role: 'admin',
      hospital
    });

    if (phone) newAdmin.phone = phone;

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ error: 'Admin registration failed' });
  }
});

// -------------------------------
// ✅ Login (All Roles)
// -------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user);

    if(user.role === 'doctor' && user.status === "pending"){
      return res.status(403).json({error: "Your account is still pending approval from admin"});
    }else{
  if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    }

    

    // const payload = {
    //   _id: user._id,
    //   role: user.role,
    //   hospital: user.hospital?._id || null,
    //   selectedHospital: user.selectedHospital?._id || null
    // };

    

    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // res.cookie('token', token, jwtOptions).json({ message: 'Login successful', role: user.role , token: token});

res.cookie("token", token, jwtOptions, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 24 * 60 * 60 * 1000,
});

res.json({
  message: "Login successful",
  token, // ✅ include this if frontend needs to decode it
});



  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', error: err.message });
  }
});

// -------------------------------
// ✅ Logout
// -------------------------------
router.post('/logout', (req, res) => {
  res.clearCookie('token', jwtOptions);
  res.json({ message: 'Logged out' });
});

// auth.routes.js or similar




// home route

// router.get()

// -------------------------------
// ✅ Get Current Logged-in User
// -------------------------------
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash -phoneEnc')
      .populate('hospital selectedHospital');

    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

export default router;
