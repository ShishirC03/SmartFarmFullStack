// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const FormData = require('form-data');

// const Detection = require('../models/detection.model');
// const router = express.Router();

// const upload = multer({ dest: 'uploads/' });
// const MODEL_URL = process.env.MODEL_URL || 'http://127.0.0.1:8000/predict';

// // POST /api/frame
// router.post('/frame', upload.single('file'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'file required' });

//   const tmpPath = req.file.path;
//   const originalName = req.file.originalname || `frame.jpg`;

//   try {
//     // 1️⃣ Send image to ML model
//     const form = new FormData();
//     form.append('file', fs.createReadStream(tmpPath), {
//       filename: originalName,
//       contentType: req.file.mimetype || 'image/jpeg',
//     });

//     const modelResp = await axios.post(MODEL_URL, form, {
//       headers: form.getHeaders(),
//       timeout: 30000,
//     });

//     const modelData = modelResp.data || {};
//     const detections = Array.isArray(modelData.detections)
//       ? modelData.detections.map((d) => ({
//           label: d.label || d.class || d.name,
//           confidence: d.confidence || d.conf || d.score || 0,
//           box: d.box || null,
//         }))
//       : [];

//     const detectedClasses = [...new Set(detections.map((d) => d.label))];

//     // ❌ FREEZE LOGIC REMOVED — ALWAYS SAVE

//     // 2️⃣ Save image permanently
//     const saveDir = path.join(__dirname, '..', 'stored_images');
//     if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

//     const saveName = `${Date.now()}_${path.basename(originalName)}`;
//     const savePath = path.join(saveDir, saveName);
//     fs.copyFileSync(tmpPath, savePath);

//     // 3️⃣ Create DB record
//     const record = {
//       source: req.body.source || 'mobile',
//       phoneId: req.body.phoneId || null,
//       timestamp: new Date(),
//       count: modelData.count || detections.length,
//       detections,
//       imagePath: `/images/${saveName}`,
//     };

//     const saved = await Detection.create(record);

//     // 4️⃣ Notify frontend via socket.io
//     const io = req.app.get('io');
//     if (io && record.count > 0) {
//       io.emit('animalDetected', { id: saved._id, ...record, skipped: false });
//     }

//     // 5️⃣ Respond to frontend
//     res.json({ status: 'ok', saved, skipped: false });
//   } catch (err) {
//     console.error('❌ detect /frame error:', err.message || err);
//     res.status(500).json({ error: 'model or save failed', detail: err.message || String(err) });
//   } finally {
//     // Always delete temp upload file
//     try {
//       if (fs.existsSync(tmpPath)) {
//         fs.unlinkSync(tmpPath);
//       }
//     } catch (e) {
//       console.error('tmp unlink err', e);
//     }
//   }
// });

// // GET /api/detections
// router.get('/detections', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page || '1');
//     const limit = Math.min(parseInt(req.query.limit || '20'), 100);
//     const skip = (page - 1) * limit;

//     const total = await Detection.countDocuments();
//     const items = await Detection.find()
//       .sort({ timestamp: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     res.json({ page, limit, total, items });
//   } catch (err) {
//     console.error('detections list error', err);
//     res.status(500).json({ error: err.message || 'Failed to fetch detections' });
//   }
// });

// module.exports = router;



// routes/detect.js
// const express = require('express');
// const axios = require('axios');
// const Detection = require('../models/detection.model');
// const router = express.Router();

// const MODEL_URL = process.env.MODEL_URL || 'http://127.0.0.1:8000/predict';

// // POST /api/frame  (expects JSON: { imageBase64: "<base64>" })
// router.post('/frame', async (req, res) => {
//   try {
//     const { imageBase64, source, phoneId } = req.body || {};

//     if (!imageBase64) {
//       return res.status(400).json({ error: 'imageBase64 required' });
//     }

//     // Forward to Python model (we POST JSON with base64)
//     const modelResp = await axios.post(
//       MODEL_URL,
//       { imageBase64 },
//       { timeout: 30000 }
//     );

//     const modelData = modelResp.data || {};
//     const detections = Array.isArray(modelData.detections)
//       ? modelData.detections.map(d => ({
//           label: d.label,
//           confidence: d.confidence
//         }))
//       : [];

//     const count = modelData.count || detections.length;

//     // Create DB record (small, no imagePath for fast mode)
//     const record = {
//       source: source || 'live',
//       phoneId: phoneId || null,
//       timestamp: new Date(),
//       count,
//       detections,
//       imagePath: null,
//     };

//     // Save detection record (optional)
//     let saved = null;
//     try {
//       saved = await Detection.create(record);
//     } catch (e) {
//       console.warn('DB save failed (non-fatal):', e.message || e);
//     }

//     // Emit to clients (socket.io)
//     const io = req.app.get('io');
//     if (io && count > 0) {
//       io.emit('animalDetected', { id: saved ? saved._id : null, ...record, skipped: false });
//     }

//     return res.json({ status: 'ok', detections, count });
//   } catch (err) {
//     console.error('❌ detect /frame error:', err.message || err);
//     return res.status(500).json({ error: 'model or save failed', detail: err.message || String(err) });
//   }
// });

// // GET /api/detections (unchanged)
// router.get('/detections', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page || '1');
//     const limit = Math.min(parseInt(req.query.limit || '20'), 100);
//     const skip = (page - 1) * limit;

//     const total = await Detection.countDocuments();
//     const items = await Detection.find()
//       .sort({ timestamp: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     res.json({ page, limit, total, items });
//   } catch (err) {
//     console.error('detections list error', err);
//     res.status(500).json({ error: err.message || 'Failed to fetch detections' });
//   }
// });

// module.exports = router;



// routes/detect.js
// routes/detect.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const http = require('http');

const Detection = require('../models/detection.model'); // your Mongoose model
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const MODEL_URL = process.env.MODEL_URL || 'http://127.0.0.1:8000/predict';

// axios with keep-alive
const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  timeout: 30000,
});

// POST /api/frame
// Accepts either multipart file 'file' (multer) OR JSON { imageBase64, sentAt }
router.post('/frame', upload.single('file'), async (req, res) => {
  try {
    const clientSentAt = req.body && req.body.sentAt ? Number(req.body.sentAt) : null;
    const serverReceivedAt = Date.now();

    // Helper to emit immediately (non-blocking save)
    const emitDetection = (payload) => {
      try {
        const io = req.app.get('io');
        if (io) io.emit('animalDetected', payload);
      } catch (e) {
        console.warn('emit failed', e);
      }
    };

    // 1) If JSON base64 present, forward it directly to model
    if (req.is('application/json') || req.body.imageBase64) {
      const imageBase64 = req.body.imageBase64;
      if (!imageBase64) return res.status(400).json({ error: 'imageBase64 required' });

      console.log('Received base64 frame length:', imageBase64.length);

      // Forward JSON to model server
      const modelResp = await axiosInstance.post(MODEL_URL, { imageBase64 });
      const modelData = modelResp.data || {};
      const detections = Array.isArray(modelData.detections) ? modelData.detections : [];
      const count = modelData.count || detections.length || 0;

      // Emit immediately (fast)
      emitDetection({
        count,
        detections,
        sentAt: clientSentAt,
        serverReceivedAt,
        forwarded: true,
        skipped: count === 0,
      });

      // Save asynchronously (do not block response)
      if (count > 0) {
        (async () => {
          try {
            const saveDir = path.join(__dirname, '..', 'stored_images');
            if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
            const saveName = `${Date.now()}.jpg`;
            const savePath = path.join(saveDir, saveName);

            let b64 = imageBase64;
            if (b64.startsWith('data:')) b64 = b64.split(',')[1];
            const buf = Buffer.from(b64, 'base64');
            fs.writeFileSync(savePath, buf);

            const record = {
              source: req.body.source || 'mobile',
              phoneId: req.body.phoneId || null,
              timestamp: new Date(),
              count,
              detections,
              imagePath: `/images/${saveName}`,
            };
            const saved = await Detection.create(record);
            console.log('Saved detection (async):', saved._id);
          } catch (e) {
            console.error('Async save failed', e);
          }
        })();
      }

      return res.json({ status: 'ok', forwarded: true, skipped: count === 0 });
    }

    // 2) Otherwise expect multipart file (multer stored in req.file)
    if (!req.file) return res.status(400).json({ error: 'file required' });

    const tmpPath = req.file.path;
    const originalName = req.file.originalname || `frame.jpg`;
    console.log('Received file upload:', originalName, 'sizeBytes:', req.file.size || 'unknown');

    // forward file to model server as form-data
    const form = new FormData();
    form.append('file', fs.createReadStream(tmpPath), {
      filename: originalName,
      contentType: req.file.mimetype || 'image/jpeg',
    });

    const modelResp = await axiosInstance.post(MODEL_URL, form, {
      headers: form.getHeaders(),
    });

    const modelData = modelResp.data || {};
    const detections = Array.isArray(modelData.detections) ? modelData.detections : [];
    const count = modelData.count || detections.length || 0;

    // Emit immediately
    emitDetection({
      count,
      detections,
      sentAt: clientSentAt,
      serverReceivedAt,
      forwarded: true,
      skipped: count === 0,
    });

    // Save asynchronously if needed
    if (count > 0) {
      (async () => {
        try {
          const saveDir = path.join(__dirname, '..', 'stored_images');
          if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
          const saveName = `${Date.now()}_${path.basename(originalName)}`;
          const savePath = path.join(saveDir, saveName);
          fs.copyFileSync(tmpPath, savePath);

          const record = {
            source: req.body.source || 'mobile',
            phoneId: req.body.phoneId || null,
            timestamp: new Date(),
            count,
            detections,
            imagePath: `/images/${saveName}`,
          };
          await Detection.create(record);
          console.log('Saved detection (async)', saveName);
        } catch (e) {
          console.error('Async save failed (file)', e);
        } finally {
          try { fs.unlinkSync(tmpPath); } catch (e) {}
        }
      })();
    } else {
      // cleanup tmp file right away
      try { fs.unlinkSync(tmpPath); } catch (e) {}
    }

    return res.json({ status: 'ok', forwarded: true, skipped: count === 0 });
  } catch (err) {
    console.error('detect /frame error:', err?.message || err);
    return res.status(500).json({ error: 'model or save failed', detail: err?.message || String(err) });
  }
});

module.exports = router;
