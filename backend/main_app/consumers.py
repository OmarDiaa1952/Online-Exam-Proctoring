from datetime import timedelta
from django.utils import timezone
from json import loads, dumps
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from .models import *
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.core.files.base import ContentFile
import face_recognition
import base64, time, os, asyncio
# from .ml_models import objectdet
import time
import requests

class ExamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection established for exam")

        # Get the user ID from the WebSocket scope
        self.student_id = self.scope['user'].id

        # Get username of the student
        self.username = self.scope['user'].username

        # Get the exam ID and student ID from the WebSocket URL
        self.exam_id = self.scope['url_route']['kwargs']['exam_id']

        # Create a unique WebSocket channel for this student
        self.channel_name = f'exam_{self.exam_id}_{self.student_id}'

        # Accept the WebSocket connection
        await self.accept()

        # Start the exam timer
        exam = await database_sync_to_async(self.get_exam)()
        self.remaining_time = exam.duration
        self.timer_task = asyncio.ensure_future(self.update_timer())

        # Initialize the cheating trials
        self.cheating_trials = 0

        # Initialize the focus status as static 
        self.focus_status = 'static'

        # define attempt_id here
        self.attempt_id = None
        
        # define counters here
        self.count = 0
        
        self.found_count = 0
        self.not_found_count = 0
        self.empty_photo_count = 0
        self.cam2_count = 0
        self.exam_start_time = time.time()

        # profile photo details
        image = face_recognition.load_image_file(f"{settings.MEDIA_ROOT}/profile_pics/user_{self.student_id}/{self.username}.jpeg")
        face_locations = face_recognition.face_locations(image)
        self.face_encodings = face_recognition.face_encodings(image, face_locations)

    def get_exam(self):
        # Get the exam object from the database
        return Exam.objects.get(id=self.exam_id)

    def create_empty_attempt(self):
        # Create an empty attempt object
        return Attempt.objects.create(exam_id=self.exam_id, student_id=self.student_id, start_time=timezone.now())
    
    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        message = loads(text_data)
        message_type = message.get('type')

        if message_type == 'start_exam':
            # create attempt object on starting the exam
            attempt = await database_sync_to_async(self.create_empty_attempt)()
            self.attempt_id = attempt.id

        elif message_type == 'photo':
            # handle photo message
            print('this is photo message')
            await self.handle_photo(message, "cam1")

        elif message_type == 'photo2':
            # handle photo message from second camera
            await self.handle_photo(message, "cam2")

        elif message_type == 'focus_status':
            # handle focus status message
            if message.get('is_focused') == 'True':
                self.focus_status = 'focused'
                print(self.focus_status)
            else:
                asyncio.get_event_loop().create_task(self.handle_focus_status(message))

        elif message_type == 'change_answer':
            # handle change answer message
            await self.change_answer(message)
            
    async def handle_focus_status(self,message):
        # Get the focus status from the message
        is_focused = message.get('is_focused')
        if is_focused == 'True':
            self.focus_status = 'focused'
            print(self.focus_status)
        else:
            # if cheating_trials>=3, disconnect
            if self.cheating_trials >= 3:
                self.cheating_trials = 0
                await self.disconnect('more than three cheating trials')
            # if the student is not focused, increment the cheating trials
            self.cheating_trials += 1
            self.focus_status = 'not_focused'
            print(self.focus_status)
            seconds = 0
            while seconds < 5:
                print(seconds)
                print(self.focus_status)
                if self.focus_status == 'focused':
                    print('focused inside loop')
                    return
                await asyncio.sleep(1)
                seconds += 1

            # if the student is not focused for 5 consecutive seconds, disconnect the WebSocket
            if self.focus_status == 'not_focused':
                await self.disconnect('not focused more than 5 seconds')

    async def change_answer(self,message):
        # Get the question ID and choice from the message
        question_id = message.get('question_id')
        choice = message.get('choice')
        answer_exists = await database_sync_to_async(Answer.objects.filter(attempt_id=self.attempt_id, question_id=question_id).exists)()
        if not answer_exists:
            # if the answer is not in the database, create a new answer object
            try:
                await database_sync_to_async(Answer.objects.create)(attempt_id=self.attempt_id, question_id=question_id, choice=choice)
            except Exception as e:
                self.send_error(e)
        else:
            # if the answer is in the database, update the answer
            try:
                await database_sync_to_async(Answer.objects.filter(attempt_id=self.attempt_id, question_id=question_id).update)(choice=choice)
            except Exception as e:
                self.send_error(e)

    async def handle_photo(self, message, camera):
        # Get the photo data from the message
        photo_data = message.get('photo_data')
        if photo_data is None:
            return
        format, imgstr = photo_data.split(';base64,') 
        ext = format.split('/')[-1] 
        data = ContentFile(base64.b64decode(imgstr), name=f"{int(time.time())}.{ext}")

        # construct the path to the media directory
        media_root = settings.MEDIA_ROOT
        media_dir = os.path.join(media_root, "exams", f"exam_{self.exam_id}", f"user_{self.student_id}, {camera}")
        os.makedirs(media_dir, exist_ok=True)
        
        # save the image to the media directory
        filename = os.path.join(media_dir, data.name)
        with open(filename, 'wb') as f:
            f.write(data.read())

        if camera == "cam1":
            self.count += 1
            test_image = face_recognition.load_image_file(filename)
            test_face_locations = face_recognition.face_locations(test_image)
            test_face_encodings = face_recognition.face_encodings(test_image, test_face_locations)

            if len(test_face_encodings) == 0:
                print("No faces found in test image")
                self.empty_photo_count += 1
            else:
                for test_face_encoding in test_face_encodings:
                    matches = face_recognition.compare_faces(self.face_encodings, test_face_encoding)
                    print(matches)
                    if True in matches:
                        print("found")
                        self.found_count += 1
                    else:
                        print("not found")
                        self.not_found_count += 1
        elif camera == "cam2":
            # call 127.0.0.1:8080/model/?file_path=filename
            self.cam2_count += 1
            response = requests.get('http://159.89.101.145:8080/model/', params={'file_path': filename})
            print(response.json())
            # send a message
            # {"type": "object_detection", "object_detected": "cell phone"/"book"/"none"}
            

            if 'cell phone' in response.json()['classes']:
                print('cell phone detected')
                await self.send_object_detection('cell phone')


            print(response.json()['classes'])
            
            if 'book' in response.json()['classes']:
                print('book detected')
                await self.send_object_detection('book')                
                
        # delete the image
        os.remove(filename)



    async def send_object_detection(self, object_detected):
        # Send an object detection message to the client-side
        try:
            await self.send(dumps({
                'type': 'object_detection',
                'object_detected': object_detected
            }))
        except Exception as e:
            print(e)

    async def send_error(self,error):
        # Send an error message to the client-side
        try:
            await self.send(dumps({
                'type': 'error',
                'error': error
            }))
        except Exception as e:
            print(e)

    async def disconnect(self, reason):
        # End the exam session
        # cancel the timer task if it is still running
        # TODELETE:


    

        exam_end_time = time.time()
        print(f"count: {self.count}, found: {self.found_count}, not found: {self.not_found_count}, empty: {self.empty_photo_count}")
        print(f"cam2 count: {self.cam2_count}")
        exam_duration = exam_end_time - self.exam_start_time
        print(f"exam duration in seconds: {exam_duration}")
        
        if self.count != 0 and self.cam2_count != 0:
            print(f"frame rate CAM1: 1 frame : {exam_duration/self.count} second")
            print(f"frame rate CAM2: 1 frame : {exam_duration/self.cam2_count} second")

        if hasattr(self, 'timer_task') and not self.timer_task.done():
            self.timer_task.cancel()
        try:
            await self.send(dumps({
                'type': 'exam_ended',
                'reason': reason
            }))
        except Exception as e:
            print(e)
        await self.close()

    async def update_timer(self):
        # Update the remaining time and send updates to the client-side
        while int(self.remaining_time.total_seconds()) > 0:
            self.remaining_time -= timedelta(seconds=1)
            await self.send(dumps({
                'type': 'timer',
                'remaining_time': str(self.remaining_time)
            }))
            await asyncio.sleep(1)
        await self.disconnect('time_up')