import cv2
from ultralytics import YOLO

# Load your trained model
model = YOLO("C:/Users/Shaurya/OneDrive/Desktop/final dataset/runs/detect/train/weights/best.pt")

# Open webcam (0) or video file path
cap = cv2.VideoCapture(0)  # Change to "C:/Users/Shaurya/OneDrive/Desktop/fy/final dataset/farm_video.mp4" for video

# Optional: Save output video
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter("C:/Users/Shaurya/OneDrive/Desktop/fy/final dataset/output.mp4",
                      fourcc, 20.0,
                      (int(cap.get(3)), int(cap.get(4))))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Run detection
    results = model(frame)

    # Annotate detections on frame
    annotated_frame = results[0].plot()

    # Show live detection
    cv2.imshow("Animal Detection", annotated_frame)

    # Save output
    out.write(annotated_frame)

    # Press q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()
