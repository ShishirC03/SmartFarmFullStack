📘 SmartFarm – AI Animal Intrusion Detection System

A React Native + Node.js based real-time farm security app

Getting Started

Note: Make sure you have completed the basic setup for React Native, Node.js, and MongoDB before running this project.

Step 1: Clone the Repository
git clone https://github.com/your-username/SmartFarm.git
cd SmartFarm


Your project structure:

SmartFarm/
 ├── backend/         # Node.js + Express server
 ├── SmartFarmApp/    # React Native mobile app

Step 2: Start the Backend Server

Navigate to backend:

cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection


Start server:

npm start


If successful, you will see:

Server running on port 5000
MongoDB connected

Step 3: Start Metro (React Native)

Open a new terminal window:

cd SmartFarmApp
npm install
npm start


This starts the Metro bundler.

Step 4: Build & Run the App

Open another terminal pane:

Android
npm run android


The app will launch inside your Android Emulator automatically.

iOS (only if Mac + Xcode)
npm run ios

Project Features
✅ Real-time Animal Detection

The backend serves the most recent animal intrusion images and detection data.

✅ Live Alerts

• Instant pop-up alerts
• Animal type and timestamp
• Detection count
• Image preview

✅ Detection History Screen

• Scrollable list of past detections
• Thumbnail preview
• Timestamp + AI confidence

✅ Stylish Modern UI

• Custom detection cards
• Gradient styling
• Accent color per animal
• Smooth animations

✅ Offline-Safe

• React Native + AsyncStorage
• Cached user data

Backend API Routes
Route	Method	Description
/api/detections/today	GET	Get today's total alerts
/api/detections/latest-file	GET	Get the most recent detection
/api/detections/history	GET	Full detection history
Folder Structure
SmartFarm/
 ├── backend/
 │    ├── routes/
 │    ├── controllers/
 │    ├── models/
 │    └── server.js
 │
 └── SmartFarmApp/
      ├── src/
      │   ├── screens/
      │   ├── components/
      │   ├── navigation/
      │   ├── utils/
      │   └── assets/
      └── App.tsx

Troubleshooting
❗ Metro not starting?
npx react-native start --reset-cache

❗ Images not loading?

• Make sure API_BASE = http://10.0.2.2:5000
 for Android
• Ensure /uploads folder in backend has public permission

❗ MongoDB connection failing?

• Check .env
• Ensure MongoDB service is running

Roadmap (Upcoming Features)

Real-time live camera streaming

More animal categories

Push notifications

Analytics dashboard

Multi-device support

License

This project is open-source under the MIT License.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
