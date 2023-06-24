print('Loading object detection model...')
import time
import yolov7

print('Loading model...')
model = yolov7.load('yolov7.pt')
print('Model loaded!')

print('Loading model 2...')
model_1 = yolov7.load('best.pt')
print('Model 2 loaded!')

model_1.names.append("Unknown")
No_face_objs = ['1802932', '1804904', '1805862', '1806837', '1807346', '1808283', '1808714', '1809252'] 

# set model parameters
model.conf = 0.5  # confidence threshold (0-1)
model_1.conf = 0.5
model_1.imgsz = 640
prob_thresh = 0.86



# set model parameters
model.conf = 0.4  # confidence threshold (0-1)
model.iou = 0.45  # NMS IoU threshold (0-1)
model.save_txt = False
model.classes = [0, 67, 73]



def detect_faces(img_path, result_path):
    results = model(img_path)
    predictions = results.pred[0][:, -1]
    class_names = [model.names[int(label)] for label in predictions]
    
    # TODELETE
    print(class_names)

    print("yolov7 normal predictions for %s: %s" % (img_path, class_names))
    person_count = sum([x=='person' for x in class_names])
    if person_count>1:
        results.save(save_dir=result_path)
        return {'status': 'cheating', 'person_count': person_count, 'reason': 'multiple people'}
    if person_count == 1:
        results = model_1(img_path)
        for i,det in enumerate(results.pred[0]):
            prob = det[4]
            if prob_thresh>= prob:
                det[-1] = len(model_1.names) -1 
            results.pred[0][i] = det
        predictions = results.pred[0][:, -1]

        person_class_names = [model_1.names[int(label)] for label in predictions]
        
        print("yolov7 best.pt predictions for %s: %s" % (img_path, person_class_names))
        if not any([x in No_face_objs for x in person_class_names]) or 'Unknown' in person_class_names:
            results.save(save_dir=result_path)
            return {'status': 'cheating', 'person_count': person_count, 'reason': 'unknown person'}
    elif person_count==0:
        results.save(save_dir=result_path)
        return {'status': 'cheating', 'person_count': person_count, 'reason': 'no person'}


        
    return {'status': "good", 'person_count': person_count, 'reason': ''}
            



def detect_objects(img_path, result_path):
    results = model(img_path)
    labels = results.pred[0][:, -1]
    class_names = [model.names[int(label)] for label in labels]
    if len(class_names) > 0:
        if ('cell phone' in class_names) or ('book' in class_names):
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

# endpoint to detect faces
@app.get("/face")
def face_recognize(file_path: str):
    # full_path = 'input/' + file_path
    response = detect_faces(file_path, 'output')
    
    return response
