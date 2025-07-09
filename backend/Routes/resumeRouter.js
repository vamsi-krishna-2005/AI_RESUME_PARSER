import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

router.post('/parse-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  console.log('📄 Received file:', req.file.originalname);

  const formData = new FormData();
  formData.append('resume', Buffer.from(req.file.buffer), req.file.originalname);

  try {
    const flaskRes = await axios.post(
      'https://python-microservice-1htu.onrender.com/parse-resume',
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,,
        timeout: 60000,
      }
    );

    console.log('✅ Flask returned:', flaskRes.data);
    res.json(flaskRes.data);

  } catch (err) {
    console.error('❌ Flask Error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error || 'Internal server error',
    });
  }
});

export default router;
