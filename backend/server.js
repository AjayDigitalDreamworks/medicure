import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import Bed from'./models/Bed.js';
import Patient from'./models/Patient.js';
import { Queue, Department } from './models/Opd.js';
import Inventory from'./models/Inventory.js';

// Load environment variables
dotenv.config();

const app = express();

// -----------------------------
//Middleware Setup
// -----------------------------

// Secure HTTP headers
app.use(helmet());

// CORS (Adjust origin for production)
// const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];
app.use(cors({
  origin: 'https://medicure-xh4v.onrender.com/',
  credentials: true,
}));


app.use(express.urlencoded({ extended: true })); // for form data
// app.use(express.json()); // for JSON requests


app.use(express.static('public')); // if using plain HTML

app.set('view engine', 'ejs');
// app.get('/', (req, res) => res.render('register'));



// JSON & Cookie parsing
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Rate limiter (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// -----------------------------
// Connect to MongoDB
// -----------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if DB fails
});

// -----------------------------
// ✅ Routes
// -----------------------------
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/patient.route.js';
import adminRoutes from './routes/admin.route.js';
import contextRoutes from './routes/context.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
// Add more routes here...


app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/patient', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/dashboard', dashboardRoutes);

// -----------------------------
// Health Check
// -----------------------------
app.get('/', async (req, res) => {
  try {
    // 1. Active Patients
    const activePatientsCount = await Patient.countDocuments();

    // 2. Available Beds
    const availableBedsCount = await Bed.countDocuments({ status: 'available' });

    // 3. Pending Queue (waiting or in-progress)
    const pendingQueueCount = await Queue.countDocuments({
      status: { $in: ['waiting', 'in-progress'] },
    });

    // 4. Medicine Stock - percentage of items that are in stock
    const totalItems = await Inventory.countDocuments();
    const inStockItems = await Inventory.countDocuments({ status: 'In Stock' });
    const medicineStockPercent = totalItems > 0 ? Math.round((inStockItems / totalItems) * 100) : 0;

    // Send actual dashboard data
    const dashboardData = [
      {
        title: 'Active Patients',
        value: activePatientsCount.toString(),
        change: '+12%', // Placeholder: you can calculate real trends later
        icon: 'BsPeopleFill',
      },
      {
        title: 'Available Beds',
        value: availableBedsCount.toString(),
        change: '-8', // Placeholder
        icon: 'BsHouseDoorFill',
      },
      {
        title: 'Pending Queue',
        value: pendingQueueCount.toString(),
        change: '+5', // Placeholder
        icon: 'BsClockFill',
      },
      {
        title: 'Medicine Stock',
        value: `${medicineStockPercent}%`,
        change: '+2%', // Placeholder
        icon: 'BsBoxSeam',
      },
    ];

    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -----------------------------
//  404 + Central Error Handler
// -----------------------------
app.use((err,req, res,next) => {
  console.log("404 hander :",err );
  res.render('404', {message: "404 - Page Not Found", tagline : "Oops! The page you're looking for doesn't exist or has been moved.", urlimg: "/img/404.png"});
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
   res.render('404', {message: "500 - Internal Server Error", tagline : "Oops! It's a Internal Error.", urlimg: "/img/500.png"});
});

// -----------------------------
//  Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;

// Added routes for password reset, reports, and scheduling emails
import passwordRoutes from './routes/password.routes.js';
import reportRoutes from './routes/report.routes.js';

app.use('/api/password', passwordRoutes);
app.use('/api/reports', reportRoutes);


import doctorRoutes from './routes/doctor.routes.js';
app.use('/api/doctor', doctorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
