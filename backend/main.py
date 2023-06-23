print('Loading object detection model...')
import yolov7

print('Loading model...')
model = yolov7.load('yolov7.pt')
print('Model loaded!')

# set model parameters
model.conf = 0.4  # confidence threshold (0-1)
model.iou = 0.45  # NMS IoU threshold (0-1)
model.save_txt = False
model.classes = [67, 73]



def detect_objects(img_path, result_path):
    results = model(img_path)
    labels = results.pred[0][:, -1]
    class_names = [model.names[int(label)] for label in labels]
    if len(class_names) > 0:
        print(class_names)
        if result_path != '':
            results.save(result_path)

    return class_names

# using fastapi to create an API

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
import json

app = FastAPI()


# root endpoint shows test.html
@app.get("/")
def home():
    return {"message": "Hello World"}


@app.get("/model")
def process_image(file_path: str):
    # full_path = 'input/' + file_path
    classes = detect_objects(file_path, 'output')
    classes = {"classes": classes}
    return classes
