
# import cv2
# from ultralytics import YOLO
# import os
# import winsound  # For playing the alert sound

# # === Load YOLO model ===
# model_path = os.path.join(os.path.dirname(__file__), "C:/Users/Shaurya/OneDrive/Desktop/final dataset/runs/detect/train/weights/best.pt")
# model = YOLO(model_path)

# # === Load class names ===
# class_names = model.names

# # === Classes to ignore (no buzzer) ===
# ignored_classes = ["person", "no_mask", "nilgai"]

# # === Webcam capture ===
# cap = cv2.VideoCapture(0)
# if not cap.isOpened():
#     print("❌ Camera not found or cannot be opened.")
#     exit()

# print("✅ Camera opened successfully. Starting live detection...")

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("⚠️ Failed to grab frame. Exiting...")
#         break

#     # Run YOLO detection
#     results = model(frame, stream=True, conf=0.7)

#     for r in results:
#         boxes = r.boxes
#         for box in boxes:
#             cls_id = int(box.cls[0])
#             conf = float(box.conf[0])
#             label = class_names.get(cls_id, "Unknown")

#             # Replace ignored class names with "New detection" for display
#             if label in ignored_classes:
#                 display_label = "New detection"
#                 buzzer_allowed = False  # no buzzer for these
#             else:
#                 display_label = label
#                 buzzer_allowed = True  # buzzer for other classes

#             # Get coordinates
#             x1, y1, x2, y2 = map(int, box.xyxy[0])

#             # Draw bounding box and label
#             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#             cv2.putText(frame, f"{display_label} ({conf:.2f})", (x1, y1 - 10),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#             # Play buzzer only if it's NOT an ignored class
#             if buzzer_allowed:
#                 alert_path = os.path.join(os.path.dirname(__file__), "alert.wav")
#                 if os.path.exists(alert_path):
#                     winsound.PlaySound(alert_path, winsound.SND_FILENAME | winsound.SND_ASYNC)
#                 else:
#                     print("⚠️ alert.wav not found!")

#     # Show annotated frame
#     cv2.imshow("Animal Detection", frame)

#     # Quit with 'q'
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# # === Cleanup ===
# cap.release()
# cv2.destroyAllWindows()
# print("🟢 Detection stopped. Camera released.")



# import cv2
# from ultralytics import YOLO
# import winsound
# import os

# # === Model and paths ===
# BASE_DIR = os.path.dirname(__file__)
# MODEL_PATH = os.path.join(BASE_DIR, "C:/Users/Shaurya/OneDrive/Desktop/final dataset/runs/detect/train/weights/best.pt")
# ALERT_PATH = os.path.join(BASE_DIR, "alert.wav")

# # === Load YOLO model ===
# model = YOLO(MODEL_PATH)
# class_names = model.names

# # === Classes to ignore ===
# ignored_classes = ["person", "no_mask", "nilgai"]

# # === Camera setup ===
# cap = cv2.VideoCapture(0)
# if not cap.isOpened():
#     print("❌ Error: Could not access camera.")
#     exit()

# print("✅ Live animal detection started... (Press 'q' to quit)")

# # === Detection Loop ===
# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("⚠️ Frame not captured, exiting...")
#         break

#     # Run YOLO inference
#     results = model(frame, stream=True, conf=0.7)
#     detected_classes = []

#     for r in results:
#         boxes = r.boxes
#         for box in boxes:
#             cls_id = int(box.cls[0])
#             conf = float(box.conf[0])
#             label = class_names.get(cls_id, "Unknown")

#             # Replace ignored classes
#             if label in ignored_classes:
#                 display_label = "New detection"
#                 buzzer_allowed = True
#             else:
#                 display_label = label
#                 buzzer_allowed = False

#             # Bounding box coordinates
#             x1, y1, x2, y2 = map(int, box.xyxy[0])
#             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#             cv2.putText(frame, f"{display_label} ({conf:.2f})", (x1, y1 - 10),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#             detected_classes.append(display_label)

#             # Play buzzer only for valid detections
#             if buzzer_allowed:
#                 if os.path.exists(ALERT_PATH):
#                     try:
#                         winsound.PlaySound(ALERT_PATH, winsound.SND_FILENAME | winsound.SND_ASYNC)
#                     except Exception as e:
#                         print("Buzzer error:", e)
#                 else:
#                     print("⚠️ alert.wav file not found!")

#     # Display annotated frame
#     cv2.imshow("Animal Detection", frame)

#     # Quit when 'q' is pressed
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# # === Cleanup ===
# cap.release()
# cv2.destroyAllWindows()
# print("🟢 Detection stopped. Camera released.")




import cv2
from ultralytics import YOLO
import winsound
import os
import time

# === Paths ===
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(BASE_DIR, "runs", "detect", "train", "weights", "best.pt")
ALERT_PATH = os.path.join(BASE_DIR, "alert.wav")

# === Load YOLO model ===
model = YOLO(MODEL_PATH)
class_names = model.names

# === Classes to ignore ===
ignored_classes = {"person", "no_mask", "nilgai"}

# === Track state ===
last_detected_classes = set()
last_buzzer_time = 0
BUZZER_COOLDOWN = 10  # seconds

# === Camera setup ===
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Error: Could not access camera.")
    exit()

print("✅ Live detection started. Press 'q' to quit.\n")

while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Frame not captured, exiting...")
        break

    results = model(frame, stream=True, conf=0.7)
    current_classes = set()
    new_detections = set()

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = class_names.get(cls_id, "Unknown")

            # Ignore unwanted classes
            if label in ignored_classes:
                continue

            current_classes.add(label)
            if label not in last_detected_classes:
                new_detections.add(label)

            # Draw bounding box
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # === Handle new detections ===
    current_time = time.time()
    if new_detections:
        print(f"🔔 New detections: {', '.join(new_detections)}")
        if current_time - last_buzzer_time > BUZZER_COOLDOWN:
            if os.path.exists(ALERT_PATH):
                winsound.PlaySound(ALERT_PATH, winsound.SND_FILENAME | winsound.SND_ASYNC)
            else:
                # fallback beep if alert.wav missing
                winsound.Beep(2000, 500)
            last_buzzer_time = current_time

    # Update tracking
    last_detected_classes = current_classes

    # Display the frame
    cv2.imshow("Animal Detection", frame)

    # Exit condition
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# === Cleanup ===
cap.release()
cv2.destroyAllWindows()
print("\n🟢 Detection stopped. Camera released.")

print("✅ Live animal detection started... (Press 'q' to quit)")

while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Frame not captured, exiting...")
        break

    results = model(frame, stream=True, conf=0.7)
    current_classes = set()
    new_detections = set()

    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = class_names.get(cls_id, "Unknown")

            # Ignore unwanted classes
            if label in ignored_classes:
                continue

            current_classes.add(label)

            # Detect new animals not seen before
            if label not in last_detected_classes:
                new_detections.add(label)

            # Draw bounding box
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # === Buzzer Logic ===
    current_time = time.time()
    if new_detections and (current_time - last_buzzer_time > BUZZER_COOLDOWN):
        print(f"🔔 New detections: {', '.join(new_detections)}")
        if os.path.exists(ALERT_PATH):
            winsound.PlaySound(ALERT_PATH, winsound.SND_FILENAME | winsound.SND_ASYNC)
        else:
            print("⚠️ alert.wav file not found!")
        last_buzzer_time = current_time

    # Update the last seen classes
    last_detected_classes = current_classes

    # Display the video frame
    cv2.imshow("Animal Detection", frame)

    # Quit when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# === Cleanup ===
cap.release()
cv2.destroyAllWindows()
print("🟢 Detection stopped. Camera released.")

