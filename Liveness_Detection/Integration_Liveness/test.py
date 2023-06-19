from keras.utils import img_to_array
from keras.models import load_model
import numpy as np
import argparse
import pickle
import time
import cv2
import os
import base64

def liveness_response(file_name):
    # load our serialized face detector from disk
    print("[INFO] loading face detector...")
    protoPath = os.path.abspath("Face_Detector/deploy.prototxt")
    modelPath = os.path.abspath("Face_Detector/res10_300x300_ssd_iter_140000.caffemodel")
    net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

    # load the liveness detector model and label encoder from disk
    print("[INFO] loading liveness detector...")
    model = load_model("liveness.model")
    le = pickle.loads(open("le.pickle", "rb").read())

    ######################
    # base64_video = video_data
    # format, base64_video = base64_video.split(';base64,')
    # ext = format.split('/')[-1]
    # video_data = base64.b64decode(base64_video)
    # media_dir = os.path.join("media")
    # os.makedirs(media_dir, exist_ok=True)
    # filename = os.path.join(media_dir, f"video.{ext}")
    ######################

    # initialize the video stream and allow the camera sensor to warmup
    print("[INFO] starting video stream...")
    cap = cv2.VideoCapture(file_name)
    time.sleep(2.0)

    # Confidence
    cf = 0.8
    #fake & real frames 
    fake_num = 0
    real_num = 0

    # define the frame skip interval
    frame_skip = 2

    # loop over the frames from the video stream
    while True:
        # grab the frame from the video stream
        ret, frame = cap.read()
        # check if the frame was read successfully
        if not ret:
            break
        
        # check if this is a frame to process
        if cap.get(cv2.CAP_PROP_POS_FRAMES) % frame_skip == 0:
            
            # resize the frame and convert it to a blob
            frame = cv2.resize(frame, (640, 480))
            (h, w) = frame.shape[:2]
            blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                        (300, 300), (104.0, 177.0, 123.0))

            # pass the blob through the network and obtain the detections and predictions
            net.setInput(blob)
            detections = net.forward()

            # loop over the detections
            for i in range(0, detections.shape[2]):
                # extract the confidence (i.e., probability) associated with the prediction
                confidence = detections[0, 0, i, 2]

                # filter out weak detections
                if confidence > cf:
                    # compute the (x, y)-coordinates of the bounding box for the face and extract the face ROI
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")

                    # ensure the detected bounding box does fall outside the dimensions of the frame
                    startX = max(0, startX)
                    startY = max(0, startY)
                    endX = min(w, endX)
                    endY = min(h, endY)

                    # extract the face ROI and preprocess it in the same manner as our training data
                    face = frame[startY:endY, startX:endX]
                    try:
                        face = cv2.resize(face, (32, 32))
                    except cv2.error:
                        # Some fallback behavior, such as skipping the current face region and moving on to the next face
                        continue
                    face = face.astype("float") / 255.0
                    face = img_to_array(face)
                    face = np.expand_dims(face, axis=0)

                    # pass the face ROI through the trained liveness detector model to determine if the face is "real" or "fake"
                    preds = model.predict(face)[0]
                    j = np.argmax(preds)
                    label = le.classes_[j]
                    label1 = le.classes_[j]
                    # draw the label and bounding box on the frame
                    label = "{}: {:.4f}".format(label, preds[j])
                    cv2.putText(frame, label, (startX, startY - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)

                    # save the frame to a file if the label is "fake" every 100 frame
                    if (label1 == "fake"):
                        filename = f"output/fake_frame{fake_num}.jpg"
                        cv2.imwrite(filename, frame)
                        fake_num += 1
                    else:
                        real_num += 1

    if fake_num >= 3 and real_num >1: 
        return False
    elif fake_num < 3 and real_num >1:
        return True
    else:
        return False

file_name = "media/Test.mp4"
out = liveness_response(file_name)
print(out)