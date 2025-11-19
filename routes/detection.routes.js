const express = require('express');
const router = express.Router();
const Detection = require('../models/detection.model');

// GET: count today’s detections
router.get('/detections/today', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Detection.countDocuments({
      timestamp: { $gte: start, $lte: end }
    });

    return res.json({ todayCount: count });
  } catch (err) {
    console.error('Error counting detections:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/detections/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Detection.findById(req.params.id).lean().exec();
    if (!doc) return res.status(404).json({ error: 'Not found' });

    res.json({ detection: doc });
  } catch (err) {
    console.error("detection detail error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
