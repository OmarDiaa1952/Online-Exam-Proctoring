from datetime import timedelta
from django.utils import timezone
from json import loads, dumps
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from .models import *
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.core.files.base import ContentFile
import base64, time, os, asyncio

class ExamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection established for exam")

        # Get the user ID from the WebSocket scope
        self.student_id = self.scope['user'].id

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

            # TODO: Start the socket connecting to the ML components here if needed
            # or create object from the model's class

        elif message_type == 'photo1':
            # handle photo message from first camera
            self.handle_photo(message, "cam1")

        elif message_type == 'photo2':
            # handle photo message from second camera
            self.handle_photo(message, "cam2")

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

    def handle_photo(self,message, camera):
        # Get the photo data from the message
        photo_data = message.get('photo_data')
        if photo_data is not None:
            format, imgstr = photo_data.split(';base64,') 
            ext = format.split('/')[-1] 
            data = ContentFile(base64.b64decode(imgstr), name=f"{int(time.time())}.{ext}")

            """ TODO: Send the photo to the ML component here using an if condition
            if camera == "cam1":
                # send the photo to the ML component for camera 1
            elif camera == "cam2":
                # send the photo to the ML component for camera 2
            
            then, recieve the response from the ML component
            if response == "cheating":
                # send a message to the client-side to display a cheating warning
                # and save the photo to the media directory -- this should be done in the ML component
            elif response == "not_cheating":
                # send a message to the client-side to remove the cheating warning --with more details
            """

            # construct the path to the media directory
            media_root = settings.MEDIA_ROOT
            media_dir = os.path.join(media_root, "exams", f"exam_{self.exam_id}", f"user_{self.student_id}, {camera}")
            os.makedirs(media_dir, exist_ok=True)
            
            # save the image to the media directory
            filename = os.path.join(media_dir, data.name)
            with open(filename, 'wb') as f:
                f.write(data.read())

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

    async def my_async_function(self):
        # This is a dummy function to test async/await
        await asyncio.sleep(1)
        

# TODO: Implement the MLConsumer class if needed
class MLConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass