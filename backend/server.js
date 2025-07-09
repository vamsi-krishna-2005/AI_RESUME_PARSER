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

const allowedOriginRegex = /^https:\/\/ai-resume-parser-[\w\-]+\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
