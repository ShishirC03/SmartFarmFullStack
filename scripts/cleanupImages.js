// // scripts/cleanupImages.js
// const path = require('path');
// const fs = require('fs').promises;
// const Detection = require('../models/detection.model'); // adjust path if needed

// const STORED_DIR = path.join(__dirname, '..', 'stored_images'); // same folder you use
// const RETENTION_DAYS = 7;

// async function deleteFileIfExists(filePath) {
//   try {
//     await fs.unlink(filePath);
//     console.log('Deleted file:', filePath);
//   } catch (err) {
//     if (err.code === 'ENOENT') {
//       return;
//     }
//     console.error('Error deleting file', filePath, err);
//   }
// }

// async function cleanup() {
//   try {
//     const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 3600 * 1000);

//     // 1) Find detections older than cutoff and delete DB doc + file
//     const oldDetections = await Detection.find({ timestamp: { $lt: cutoff } }).lean();

//     for (const det of oldDetections) {
//       if (det.imagePath) {
//         const fullPath = path.join(STORED_DIR, det.imagePath);
//         await deleteFileIfExists(fullPath);
//       }
//       await Detection.deleteOne({ _id: det._id });
//       console.log('Deleted detection doc:', det._id);
//     }

//     // 2) Remove orphan files older than cutoff
//     const referencedDocs = await Detection.find({}, 'imagePath').lean();
//     const referenced = new Set(referencedDocs.map(d => d.imagePath).filter(Boolean));

//     const walk = async (dir) => {
//       const items = await fs.readdir(dir, { withFileTypes: true });
//       for (const it of items) {
//         const full = path.join(dir, it.name);
//         if (it.isDirectory()) {
//           await walk(full);
//         } else {
//           const rel = path.relative(STORED_DIR, full).replace(/\\/g, '/');
//           if (!referenced.has(rel)) {
//             const stat = await fs.stat(full);
//             if (stat.mtime < cutoff) {
//               await deleteFileIfExists(full);
//               console.log('Deleted orphan file:', rel);
//             }
//           }
//         }
//       }
//     };

//     // Only walk if directory exists
//     try {
//       await fs.access(STORED_DIR);
//       await walk(STORED_DIR);
//     } catch (e) {
//       // stored_images doesn't exist -> nothing to do
//     }

//     console.log('Cleanup finished at', new Date().toISOString());
//     return { success: true };
//   } catch (err) {
//     console.error('Cleanup error', err);
//     throw err;
//   }
// }

// module.exports = { cleanup };
