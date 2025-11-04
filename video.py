import cv2
import time
from ultralytics import YOLO

# ---------------- CONFIG ----------------
MODEL_PATH = "C:/Users/Shaurya/OneDrive/Desktop/final dataset/runs/detect/train/weights/best.pt"
VIDEO_SOURCE = 0  # or 0 for webcam
CONF = 0.7           # min confidence
IMG_SIZE = 640           # inference size
PRESENCE_THRESHOLD = 3   # frames a class must appear consecutively before we accept it
RESET_AFTER_NO_DET = 5.0 # seconds with no detections to reset printed_classes
# ----------------------------------------

model = YOLO(MODEL_PATH)
cap = cv2.VideoCapture(VIDEO_SOURCE)

# state for stability + printing
consecutive_counts = {}           # class_name -> consecutive-frame count
printed_classes = set()           # classes we've printed already
last_detection_time = time.time() # for reset behavior

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Run inference
    results = model.predict(frame, conf=CONF, imgsz=IMG_SIZE, verbose=False)
    r = results[0]

    # Collect detected classes this frame
    classes_in_frame = []
    if hasattr(r, "boxes") and len(r.boxes) > 0:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            cls_name = model.names[cls_id]
            conf = float(box.conf[0])

            if conf < CONF:  # low confidence = unknown
                cls_name = "Unknown"

            classes_in_frame.append(cls_name)

    # Update last_detection_time
    if classes_in_frame:
        last_detection_time = time.time()

    # Update consecutive counts
    present = set(classes_in_frame)
    # Reset counts for absent classes
    for cls in list(consecutive_counts.keys()):
        if cls not in present:
            consecutive_counts.pop(cls)
    # Increment counts for present ones
    for cls in present:
        consecutive_counts[cls] = consecutive_counts.get(cls, 0) + 1

    # Print only new, stable detections
    for cls, count in consecutive_counts.items():
        if count >= PRESENCE_THRESHOLD and cls not in printed_classes:
            print(f"✅ New detection: {cls}")
            printed_classes.add(cls)

    # Reset after inactivity
    if time.time() - last_detection_time > RESET_AFTER_NO_DET:
        if printed_classes:
            printed_classes.clear()
            consecutive_counts.clear()
            print("⚠️ No detections for a while — reset.")

    # Show annotated video
    annotated_frame = r.plot()
    cv2.imshow("Animal Detection", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
