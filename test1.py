import argparse
import io
from PIL import Image
import datetime
import torch
import cv2
import numpy as np
import tensorflow as tf
from re import DEBUG, sub
import os
import subprocess
from subprocess import Popen
import re
import requests
import shutil
import time
import base64
import pandas as pd
from detect import *

class Namespace:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

opt = Namespace(weights=['best.pt'], source='', img_size=640, conf_thres=0.5, iou_thres=0.45, device='', view_img=True, save_txt=False, save_conf=False, nosave=False, classes=None, agnostic_nms=False, augment=False, update=False, project='runs/detect', name='exp', exist_ok=False, no_trace=True)

def run_model(opt):
    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in ['yolov7.pt']:
                v = detect(opt)
                strip_optimizer(opt.weights)
        else:
            v = detect(opt)
    return v

def phase_response(dir):
    #index = 0
    # Loop over all files in the directory
    for filename in os.listdir(dir):
        # Check if the file is a JPEG image
        if filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png'):
            # Construct the full path to the image file
            image_path = os.path.join(dir, filename)
            # Load the image from disk
            img = cv2.imread(image_path)
            # Display the image
            # cv2.imshow(filename, img)
            opt.source = image_path
            #command = f"python detect.py --weights best.pt --conf 0.5 --source {image_path} --view-img --no-trace"
            # Run the command in the shell
            #subprocess.run(command, shell=True)
            v = run_model(opt)
            if v == "No":
                print("No Faces Found")
                break
            os.remove(image_path)
            time.sleep(5)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

phase_response("input")