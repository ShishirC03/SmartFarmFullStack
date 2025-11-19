# model_server.py
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ultralytics import YOLO
from PIL import Image, ImageOps
import io, os, base64, time, traceback, asyncio

# Load env
load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")
print("Loading model from:", MODEL_PATH)
model = YOLO(MODEL_PATH)

app = FastAPI(title="SmartFarm AI Model Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    try:
        names = getattr(model, "names", None)
        print("MODEL NAMES:", names)
        # optional warmup to avoid first-call delay:
        try:
            img = Image.new("RGB", (640, 640), color=(0, 0, 0))
            _ = model(img)  # warm model once (safe)
            print("Model warmup done")
        except Exception as e:
            print("Model warmup failed (non-fatal):", e)
    except Exception as e:
        print("Error reading model.names:", e)

@app.get("/")
def home():
    return {"message": "✅ Model Server Running!"}


def run_inference_on_pil(image: Image.Image, conf_thresh: float = 0.35, imgsz: int = 640):
    """
    Synchronous inference function that accepts a PIL image (already RGB and correctly
    oriented) and returns a normalized list of detection dicts.
    """
    # Ensure RGB (should already be RGB after conversion, but safe)
    image = image.convert("RGB")

    # Run model with explicit parameters so results are consistent
    results = model(image, imgsz=imgsz, conf=conf_thresh, verbose=False)

    detections = []
    names = getattr(model, "names", {})

    try:
        boxes = results[0].boxes
    except Exception:
        boxes = []

    # debug
    print(f"[DEBUG] inference: {len(boxes)} raw boxes returned (conf_thresh={conf_thresh}, imgsz={imgsz})")

    for idx, box in enumerate(boxes):
        try:
            cls_idx = int(box.cls) if hasattr(box, "cls") else int(getattr(box, "class", 0))
        except Exception:
            cls_idx = 0

        conf = float(box.conf) if getattr(box, "conf", None) is not None else 0.0
        label = names.get(cls_idx, str(cls_idx))

        xyxy = None
        try:
            if hasattr(box, "xyxy"):
                arr = box.xyxy.cpu().numpy() if hasattr(box.xyxy, "cpu") else box.xyxy
                xyxy = arr.tolist() if hasattr(arr, "tolist") else arr
        except Exception:
            xyxy = None

        print(f"[DEBUG] box #{idx}: cls_idx={cls_idx} name='{label}' conf={conf:.3f} xyxy={xyxy}")

        if conf >= conf_thresh:
            detections.append({
                "label": label,
                "class_idx": cls_idx,
                "confidence": round(conf, 4),
                "box": xyxy
            })

    return detections


# unified endpoint: accept either file upload (multipart) or JSON { imageBase64 }
@app.post("/predict")
async def predict(file: UploadFile = File(None), request: Request = None):
    start_ts = time.time()
    server_received = time.time()
    try:
        # 1) multipart file path
        if file is not None:
            img_bytes = await file.read()
            # open image and auto-rotate according to EXIF, then convert to RGB
            image = Image.open(io.BytesIO(img_bytes))
            image = ImageOps.exif_transpose(image).convert("RGB")

        else:
            # 2) JSON body with base64
            body = await request.json()
            image_b64 = body.get("imageBase64")
            if not image_b64:
                return {"status": "error", "message": "no file or imageBase64 provided"}
            # If client included data URI prefix, strip it:
            if image_b64.startswith("data:"):
                image_b64 = image_b64.split(",", 1)[1]
            img_bytes = base64.b64decode(image_b64)
            image = Image.open(io.BytesIO(img_bytes))
            image = ImageOps.exif_transpose(image).convert("RGB")

        # Run inference off the async loop to avoid blocking (use thread)
        # You can tweak conf_thresh and imgsz here
        detections = await asyncio.to_thread(run_inference_on_pil, image, 0.35, 640)
        elapsed = time.time() - start_ts

        print(f"[INFO] predict finished: {len(detections)} detections, elapsed={elapsed:.3f}s")

        return {
            "status": "success",
            "detections": detections,
            "count": len(detections),
            "took": elapsed,
            "serverReceivedAt": server_received
        }

    except Exception as e:
        tb = traceback.format_exc()
        print("[ERROR] predict exception:", e, tb)
        return {"status": "error", "message": str(e), "trace": tb}
