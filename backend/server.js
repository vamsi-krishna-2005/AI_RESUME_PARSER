import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './Routes/auth.js';
import jobRoutes from './Routes/job.js';
import postRoutes from './Routes/postRouter.js';
import resumeRouter from './Routes/resumeRouter.js';
import PaymentRouter from './Routes/payment.js';

dotenv.config();
const app = express();
connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-resume-parser-qclgh1wbf-vamsis-projects-467aa190.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`🔍 Request from: ${req.headers.origin}`);
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/parse', resumeRouter);
app.use('/api/log-payment', PaymentRouter);
// You can add job/post routes here as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
