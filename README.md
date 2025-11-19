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
Navigate to the backend folder:

Bash

cd backend
Install dependencies:

Bash

npm install
Create a .env file with PORT, MONGO_URI, and MODEL_SERVER_URL.

Start the server:

Bash

npm start
📱 Step 3: Start Metro (React Native Bundler)
Navigate to the app folder:

Bash

cd SmartFarmApp
Install dependencies:

Bash

npm install
Start the bundler:

Bash

npm start
🤖 Step 4: Run the App
Android: npm run android (Remember to use http://10.0.2.2:5000 for the backend URL on the emulator).

iOS: npm run ios
