// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   Vibration,
//   AppState,
//   AppStateStatus,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { MainStackParamList } from "../../navigation/mainStakeNavigator/mainStakeNavigator";
// import { RNCamera } from "react-native-camera";
// import BackArrow from "../../assets/svg/BackArrow";
// import { io, Socket } from "socket.io-client";

// type LiveFeedNavProp = NativeStackNavigationProp<
//   MainStackParamList,
//   "LiveFeedScreen"
// >;

// // SEND FRAME EVERY 1500 ms (≈ 1.5 sec)
// const FRAME_INTERVAL = 1000;

// const BACKEND_URL = "http://10.0.2.2:5000/api/frame";
// const BACKEND_WS = "http://10.0.2.2:5000";

// const LiveFeedScreen = () => {
//   const navigation = useNavigation<LiveFeedNavProp>();
//   const cameraRef = useRef<RNCamera | null>(null);

//   const [hasPermission, setHasPermission] = useState(false);
//   const [autoSending, setAutoSending] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const isSendingRef = useRef(false);

//   const intervalRef = useRef<number | null>(null);
//   const socketRef = useRef<Socket | null>(null);

//   const [appState, setAppState] = useState<AppStateStatus>(
//     AppState.currentState
//   );

//   // ---------------- SOCKET.IO ----------------
//   useEffect(() => {
//     const socket: Socket = io(BACKEND_WS, { transports: ["websocket"] });
//     socketRef.current = socket;

//     const onConnect = () => {
//       console.log("Socket connected:", socket.id);
//     };

//     const onAnimalDetected = (payload: any) => {
//       if (!payload) return;
//       // compute latency if sentAt included
//       const now = Date.now();
//       const sentAt = payload.sentAt ? Number(payload.sentAt) : null;
//       const serverReceivedAt = payload.serverReceivedAt ? Number(payload.serverReceivedAt) : null;
//       let roundTripMs: number | null = null;
//       if (sentAt) {
//         roundTripMs = now - sentAt;
//         console.log("Round-trip ms (mobile -> model -> mobile):", roundTripMs);
//       }
//       if (serverReceivedAt && sentAt) {
//         console.log("Upload -> server -> model time (ms):", serverReceivedAt - sentAt);
//       }

//       if (payload.skipped) {
//         // optional: ignore skipped notifications
//         return;
//       }

//       if (payload.count && payload.count > 0) {
//         const labels = payload.detections?.map((d: any) => d.label).filter(Boolean).join(", ") || "Unknown";
//         try { Vibration.vibrate([300, 150, 300]); } catch (e) {}
//         Alert.alert("🐾 Animal Detected!", `${labels}\nLatency: ${roundTripMs ?? "n/a"} ms`);
//       }
//     };

//     socket.on("connect", onConnect);
//     socket.on("animalDetected", onAnimalDetected);

//     return () => {
//       try {
//         socket.off("connect", onConnect);
//         socket.off("animalDetected", onAnimalDetected);
//         socket.disconnect();
//       } catch (e) {
//         console.warn("Socket cleanup error:", e);
//       } finally {
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   // ---------------- APPSTATE ----------------
//   useEffect(() => {
//     const sub = AppState.addEventListener("change", (s) => setAppState(s));
//     return () => sub.remove();
//   }, []);

//   // ---------------- PERMISSION ----------------
//   useEffect(() => {
//     const ask = async () => {
//       if (Platform.OS === "android") {
//         try {
//           const g = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA
//           );
//           setHasPermission(g === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.warn("Permission request error:", err);
//           setHasPermission(false);
//         }
//       } else {
//         setHasPermission(true);
//       }
//     };
//     ask();
//   }, []);

//   // ---------------- LOOP CONTROL ----------------
//   useEffect(() => {
//     const canRun =
//       autoSending && hasPermission && cameraReady && appState === "active";

//     if (canRun) startLoop();
//     else stopLoop();

//     return () => stopLoop();
//   }, [autoSending, hasPermission, cameraReady, appState]);

//   const startLoop = () => {
//     if (intervalRef.current) return;
//     intervalRef.current = (setInterval(
//       () => captureAndSend(),
//       FRAME_INTERVAL
//     ) as unknown) as number;
//     console.log("Loop started");
//   };

//   const stopLoop = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//     intervalRef.current = null;
//     isSendingRef.current = false;
//     console.log("Loop stopped");
//   };

//   // ---------------- CAPTURE & SEND ----------------
//   const captureAndSend = async () => {
//     if (!cameraRef.current || !hasPermission || !cameraReady) return;
//     if (!autoSending || appState !== "active") return;
//     if (isSendingRef.current) return;

//     isSendingRef.current = true;

//     try {
//       // capture image as base64 (keeps RN simple)
//       const photo = await cameraRef.current.takePictureAsync({
//         base64: true,
//         quality: 0.45, // reduce size for speed
//         width: 640,
//       });

//       if (!photo.base64) return;

//       // Send base64 plus sentAt timestamp
//       const sentAt = Date.now();
//       await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ imageBase64: photo.base64, sentAt }),
//       });
//     } catch (err) {
//       console.log("capture error:", err);
//     } finally {
//       isSendingRef.current = false;
//     }
//   };

//   // manual capture (scare)
//   const handleManualCapture = async () => {
//     await captureAndSend();
//     Alert.alert("Scare Triggered!");
//   };

//   // ---------------- UI ----------------
//   if (!hasPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera permission is required.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <BackArrow width={24} height={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Live Camera</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Camera */}
//       <RNCamera
//         ref={cameraRef}
//         style={styles.cameraView}
//         type={RNCamera.Constants.Type.back}
//         captureAudio={false}
//         onCameraReady={() => setCameraReady(true)}
//       />

//       {/* Controls */}
//       <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
//         <TouchableOpacity
//           style={[
//             styles.controlButton,
//             { backgroundColor: autoSending ? "#ffb3ae" : "#b7f5b7" },
//           ]}
//           onPress={() => setAutoSending((p) => !p)}
//         >
//           <Text style={styles.controlText}>
//             {autoSending ? "Stop Auto-Send" : "Start Auto-Send"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.scareButton}
//           onPress={handleManualCapture}
//         >
//           <Text style={styles.scareText}>Scare</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default LiveFeedScreen;

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     justifyContent: "space-between",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
//   cameraView: {
//     flex: 1,
//     marginHorizontal: 16,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   scareButton: {
//     backgroundColor: "#B9EAB5",
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 12,
//     alignItems: "center",
//   },
//   scareText: { fontSize: 16, fontWeight: "600", color: "#000" },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   permissionText: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   controlButton: {
//     height: 48,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   controlText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000",
//     paddingVertical: 12,
//   },
// });

// src/screens/livefeedScreen/liveFeedScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  Vibration,
  AppState,
  AppStateStatus,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/mainStakeNavigator/mainStakeNavigator";
import { RNCamera } from "react-native-camera";
import BackArrow from "../../assets/svg/BackArrow";
import { io, Socket } from "socket.io-client";

type LiveFeedNavProp = NativeStackNavigationProp<
  MainStackParamList,
  "LiveFeedScreen"
>;

// SEND FRAME EVERY 1000 ms (≈ 1 sec)
const FRAME_INTERVAL = 1000;

const BACKEND_URL = "http://10.0.2.2:5000/api/frame";
const BACKEND_WS = "http://10.0.2.2:5000";

const LiveFeedScreen = () => {
  const navigation = useNavigation<LiveFeedNavProp>();
  const cameraRef = useRef<RNCamera | null>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [autoSending, setAutoSending] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const isSendingRef = useRef(false);

  const intervalRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  // ---------------- SOCKET.IO ----------------
  useEffect(() => {
    const socket: Socket = io(BACKEND_WS, { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const onAnimalDetected = (payload: any) => {
      if (!payload) return;
      // compute latency if sentAt included
      const now = Date.now();
      const sentAt = payload.sentAt ? Number(payload.sentAt) : null;
      const serverReceivedAt = payload.serverReceivedAt ? Number(payload.serverReceivedAt) : null;
      let roundTripMs: number | null = null;
      if (sentAt) {
        roundTripMs = now - sentAt;
        console.log("Round-trip ms (mobile -> model -> mobile):", roundTripMs);
      }
      if (serverReceivedAt && sentAt) {
        console.log("Upload -> server -> model time (ms):", serverReceivedAt - sentAt);
      }

      if (payload.skipped) {
        // optional: ignore skipped notifications
        return;
      }

      if (payload.count && payload.count > 0) {
        const labels = payload.detections?.map((d: any) => d.label).filter(Boolean).join(", ") || "Unknown";
        try { Vibration.vibrate([300, 150, 300]); } catch (e) {}
        Alert.alert("🐾 Animal Detected!", `${labels}\nLatency: ${roundTripMs ?? "n/a"} ms`);
      }
    };

    socket.on("connect", onConnect);
    socket.on("animalDetected", onAnimalDetected);

    return () => {
      try {
        socket.off("connect", onConnect);
        socket.off("animalDetected", onAnimalDetected);
        socket.disconnect();
      } catch (e) {
        console.warn("Socket cleanup error:", e);
      } finally {
        socketRef.current = null;
      }
    };
  }, []);

  // ---------------- APPSTATE ----------------
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => setAppState(s));
    return () => sub.remove();
  }, []);

  // ---------------- PERMISSION ----------------
  useEffect(() => {
    const ask = async () => {
      if (Platform.OS === "android") {
        try {
          const g = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          setHasPermission(g === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn("Permission request error:", err);
          setHasPermission(false);
        }
      } else {
        setHasPermission(true);
      }
    };
    ask();
  }, []);

  // ---------------- LOOP CONTROL ----------------
  useEffect(() => {
    const canRun =
      autoSending && hasPermission && cameraReady && appState === "active";

    if (canRun) startLoop();
    else stopLoop();

    return () => stopLoop();
  }, [autoSending, hasPermission, cameraReady, appState]);

  const startLoop = () => {
    if (intervalRef.current) return;
    intervalRef.current = (setInterval(
      () => captureAndSend(),
      FRAME_INTERVAL
    ) as unknown) as number;
    console.log("Loop started");
  };

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;
    isSendingRef.current = false;
    console.log("Loop stopped");
  };

  // ---------------- CAPTURE & SEND ----------------
  const captureAndSend = async () => {
    if (!cameraRef.current || !hasPermission || !cameraReady) return;
    if (!autoSending || appState !== "active") return;
    if (isSendingRef.current) return;

    isSendingRef.current = true;

    try {
      // capture image as base64 WITHOUT reducing quality
      // request native layer to fix orientation and include exif for debugging
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 1.0,            // do not reduce quality
        fixOrientation: true,   // ask native to return upright pixels
        forceUpOrientation: true,// helps on some Android devices
        exif: true,              // include exif for debugging
      });

      // debug logs: exif and keys (helpful to see what's coming from device)
      console.log("photo keys:", Object.keys(photo));
      if (photo.exif) {
        console.log("photo.exif sample:", {
          Orientation: photo.exif.Orientation ?? photo.exif.ImageOrientation ?? null,
          Make: photo.exif.Make ?? null,
          Model: photo.exif.Model ?? null,
        });
      } else {
        console.log("photo.exif: none");
      }

      if (!photo.base64) {
        console.warn("No base64 returned from takePictureAsync");
        return;
      }

      // Send base64 plus sentAt timestamp
      const sentAt = Date.now();
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: photo.base64, sentAt }),
      });
    } catch (err) {
      console.log("capture error:", err);
    } finally {
      isSendingRef.current = false;
    }
  };

  // manual capture (scare)
  const handleManualCapture = async () => {
    await captureAndSend();
    Alert.alert("Scare Triggered!");
  };

  // ---------------- UI ----------------
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Camera</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Camera */}
      <RNCamera
        ref={cameraRef}
        style={styles.cameraView}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onCameraReady={() => setCameraReady(true)}
      />

      {/* Controls */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: autoSending ? "#ffb3ae" : "#b7f5b7" },
          ]}
          onPress={() => setAutoSending((p) => !p)}
        >
          <Text style={styles.controlText}>
            {autoSending ? "Stop Auto-Send" : "Start Auto-Send"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scareButton}
          onPress={handleManualCapture}
        >
          <Text style={styles.scareText}>Scare</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveFeedScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  cameraView: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  scareButton: {
    backgroundColor: "#B9EAB5",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  scareText: { fontSize: 16, fontWeight: "600", color: "#000" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  permissionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    paddingVertical: 12,
  },
});
