const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // user who owns the detection
  source: { type: String, default: 'mobile' },
  phoneId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
  detections: [
    {
      label: String,
      confidence: Number,
      box: { x: Number, y: Number, w: Number, h: Number },
    },
  ],
  imagePath: { type: String, default: null }, // e.g., /images/<userId>/<filename>.jpg
});

// ✅ TTL index: automatically delete documents 7 days after their timestamp
// 7 days = 7 * 24 * 3600 seconds
detectionSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });

// Optional: useful index for fast per-user queries
detectionSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('detection', detectionSchema);
