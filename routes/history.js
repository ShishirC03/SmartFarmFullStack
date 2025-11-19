// routes/history.js
const express = require('express');
const router = express.Router();
const Detection = require('../models/detection.model'); // matches detection.model.js
 // adjust path
const mongoose = require('mongoose');

// GET /api/detections/history
// Query params: page=1, limit=20, animal=Cow (optional), from=YYYY-MM-DD, to=YYYY-MM-DD
router.get('/history', async (req, res) => {
    console.log('===> GET /api/detections/history called, query=', req.query);
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const animal = req.query.animal;
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const match = {};
    // If animal filter provided, match any detection with that label
    if (animal) {
      match['detections.label'] = animal;
    }
    if (from || to) {
      match.timestamp = {};
      if (from) match.timestamp.$gte = from;
      if (to) match.timestamp.$lte = to;
    }

    // total count for pagination
    const total = await Detection.countDocuments(match);

    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const data = await Detection.find(match)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // return minimal metadata: imagePath kept as saved (/images/...)
    res.json({ data, page, totalPages, total });
  } catch (err) {
    console.error('history error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
