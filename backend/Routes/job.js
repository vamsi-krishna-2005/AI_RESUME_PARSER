const express = require('express');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

module.exports = router; 