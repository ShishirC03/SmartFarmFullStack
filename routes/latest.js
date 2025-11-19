// routes/latest.js
const express = require('express');
const router = express.Router();
const Detection = require('../models/detection.model'); // adjust path

// GET /api/detections/latest-file
router.get('/latest-file', async (req, res) => {
  try {
    const doc = await Detection.findOne({}).sort({ timestamp: -1 }).lean().exec();
    if (!doc) return res.status(404).json({ error: 'No detections yet' });
    return res.json({ detection: doc });
  } catch (err) {
    console.error('latest-file error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
