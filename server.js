// server.js (clean version)
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// load .env as early as possible
dotenv.config();

// routers & db
const authRouter = require("./routes/auth");
const detectRouter = require("./routes/detect");
const connectDB = require("./config/db");

// create app BEFORE using it
const app = express();

// ensure stored_images directory exists (so static serving won't fail)
const storedImagesDir = path.join(__dirname, "stored_images");
const fs = require("fs");
if (!fs.existsSync(storedImagesDir)) {
  fs.mkdirSync(storedImagesDir, { recursive: true });
}

// serve saved images at /images/<filename>
app.use("/images", express.static(storedImagesDir));

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

// --- Connect DB ---
connectDB();

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api", detectRouter);
app.use('/api', require('./routes/detection.routes'));
// History Route
const historyRouter = require("./routes/history");
app.use("/api/detections", historyRouter);

const latestRouter = require('./routes/latest');
app.use('/api/detections', latestRouter);

// Health-check
app.get("/", (req, res) => {
  res.send("🚀 Server running and MongoDB connected!");
});

// --- Create HTTP server so socket.io can attach ---
const server = http.createServer(app);

// --- SOCKET.IO: attach and expose to routes ---
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("pingFromClient", (payload) => {
    console.log("pingFromClient", payload);
    socket.emit("pongFromServer", { msg: "pong" });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

// --- Basic error handler (optional) ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
