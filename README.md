# 🐒 SmartFarm – AI Animal Intrusion Detection System

**SmartFarm** is a **React Native + Node.js** based real-time farm security system designed to protect crops and livestock from animal intrusion.

It leverages mobile camera technology to detect various animals (e.g., **Monkey**, **Cow**, **Goat**, **Nilgai**, **Wild Boar**), processes the frames using a backend-powered **YOLO model**, and instantly alerts the farmer through **Socket.IO**. The system also stores all processed images and maintains a complete detection history for auditing.

---

## ✨ Features

* **Real-time Alerts:** Instant notifications via **Socket.IO** upon animal detection.
* **On-device Camera Feed:** Utilizes the mobile camera for live monitoring.
* **Comprehensive History:** Stores all detection events and associated images in **MongoDB**.
* **Dashboard:** Shows the latest detection and today's total alert count.
* **Live Feed:** Real-time camera streaming with immediate alert updates.
* **Scalable Architecture:** **React Native** (Mobile App) + **Node.js/Express** (Backend).

---

## 🚀 Getting Started

> **Note:** Before running the project, ensure you have set up the following prerequisites:
>
> * **Node.js (LTS)**
> * **MongoDB** (Local or Cloud instance)
> * **React Native environment** (Follow the official guide: [Set up your environment](https://reactnative.dev/docs/set-up-your-environment))
> * **Android Studio Emulator** (Recommended for Android development)

### 📥 Step 1: Clone the Repository

```bash
git clone [https://github.com/your-username/SmartFarm.git](https://github.com/your-username/SmartFarm.git)
cd SmartFarm
🖥️ Step 2: Start the Backend Server

Navigate to backend folder:

cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri_here
MODEL_SERVER_URL=http://localhost:8000


Start backend:

npm start


If successful, you should see:

Server running on port 5000
MongoDB connected

📱 Step 3: Start Metro (React Native)

Open a new terminal:

cd SmartFarmApp
npm install
npm start


This will run the Metro bundler.

🤖 Step 4: Build & Run the App
Android (Recommended)
npm run android


Important: On Android Emulator, React Native must use:
http://10.0.2.2:5000 to talk to backend.

iOS (macOS only)
npm run ios

📡 How the System Works

Mobile app captures camera frames.

Frames are sent to backend /api/frame.

Backend forwards the image to YOLO model server.

If an animal is detected:

Stores processed image (/stored_images)

Creates a Detection document in MongoDB

Emits animalDetected via Socket.IO

App instantly receives the alert & updates UI.

🧠 Key Backend API Endpoints
Endpoint	Method	Description
/api/frame	POST	Upload frames for detection
/api/detections/today	GET	Count of today’s detections
/api/detections/latest-file	GET	Latest saved detection
/api/detections/history	GET	Paginated detection history
/images/<file>	GET	Serves stored images
📲 App Features
Dashboard

Shows latest detection

Shows today's alert count

Quick actions (Refresh / Live Feed)

History

Displays all past detections

Tap image to open full screen view

Styled cards grouping type & confidence

Live Feed

Real-time camera frames → backend

Immediate alerts via Socket.IO

🗄️ Folder Structure Overview
backend/
 ├── models/
 ├── routes/
 ├── controllers/
 ├── stored_images/
 ├── server.js

SmartFarmApp/
 ├── src/
 │   ├── screens/
 │   ├── components/
 │   ├── utils/
 │   ├── navigation/
 └── App.tsx

📸 Image Storage

All images are saved automatically at:

backend/stored_images/


And served publicly at:

http://<server>/images/<filename>.jpg

🔧 Testing Realtime Alerts

Add this temporary backend route:

app.get('/test-emit', (req, res) => {
  const io = req.app.get('io');
  io.emit('animalDetected', {
    detection: {
      _id: 'test',
      timestamp: new Date(),
      imagePath: '/images/sample.jpg',
      detections: [{ label: 'Monkey', confidence: 0.92 }],
      count: 1
    }
  });
  res.json({ emitted: true });
});


Visit in browser:

http://localhost:5000/test-emit


Your app should instantly show an alert.

🛠️ Troubleshooting
Metro stuck or cached errors:
npx react-native start --reset-cache

Android cannot load backend URLs:

Use IP:

http://10.0.2.2:5000

Image not showing?

Make sure path stored in DB starts with /images/...

Ensure stored_images folder exists

Check app uses imageUrl() helper

📅 Roadmap

Push notifications

Multi-camera support

Offline mode

Admin web dashboard

More animal types & improved accuracy

🤝 Contributing

Fork repo

Create branch:

git checkout -b feature/my-feature


Commit changes

Create Pull Request

📄 License

MIT License © 2025 SmartFarm
