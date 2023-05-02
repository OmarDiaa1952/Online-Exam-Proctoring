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

        # Initialize the not_focused_count
        self.not_focused_count = 0

        # Initialize the probable_cheating_times
        self.cheating_trials = 0

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
        
        elif message_type == 'photo':
            # handle photo message
            self.handle_photo(message)

        elif message_type == 'focus_status':
            # handle focus status message
            self.handle_focus_status(message)
            
    def handle_photo(self,message):
        # Get the photo data from the message
        photo_data = message.get('photo_data')
        if photo_data is not None:
            format, imgstr = photo_data.split(';base64,') 
            ext = format.split('/')[-1] 
            data = ContentFile(base64.b64decode(imgstr), name=f"{int(time.time())}.{ext}")

            # construct the path to the media directory
            media_root = settings.MEDIA_ROOT
            media_dir = os.path.join(media_root, "exams", f"exam_{self.exam_id}", f"user_{self.student_id}")
            os.makedirs(media_dir, exist_ok=True)
            
            # save the image to the media directory
            filename = os.path.join(media_dir, data.name)
            with open(filename, 'wb') as f:
                f.write(data.read())

    def handle_focus_status(self,message):
        # Get the focus status from the message
        is_focused = message.get('is_focused')
        if is_focused:
            self.not_focused_count = 0
        else:
            if self.cheating_trials >= 3:
                self.disconnect('trying to cheat for 3 times')
            self.not_focused_count += 1

        if self.not_focused_count == 2:
            self.cheating_trials += 1
            self.send_warning('3 seconds')

        elif self.not_focused_count == 3:
            self.send_warning('2 seconds')

        elif self.not_focused_count == 4:
            self.send_warning('1 second')

        elif self.not_focused_count >= 5:
            self.disconnect('not focused for 5 seconds or more')

    async def send_warning(self,remaining_time):
        # Send a warning message to the client-side
        await self.send(dumps({
            'type': 'warning',
            'remaining_time_for_ending_exam': remaining_time
        }))

    async def disconnect(self, reason):
        # End the exam session
        # cancel the timer task if it is still running
        if hasattr(self, 'timer_task') and not self.timer_task.done():
            self.timer_task.cancel()
        await self.send(dumps({
            'type': 'exam_ended',
            'reason': reason
        }))
        await self.close()

    async def update_timer(self):
        # Update the remaining time and send updates to the client-side
        while int(self.remaining_time.total_seconds()) > 0:
            self.remaining_time -= timedelta(seconds=1)
            await asyncio.sleep(1)
            await self.send(dumps({
                'type': 'timer',
                'remaining_time': str(self.remaining_time)
            }))
        await self.disconnect('time_up')