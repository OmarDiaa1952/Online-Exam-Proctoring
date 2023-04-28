from datetime import timedelta
from json import loads, dumps
import os
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from .models import Exam
from asgiref.sync import sync_to_async
import asyncio
from channels.db import database_sync_to_async
from django.core.files.base import ContentFile
import base64
import time

class ExamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection established for exam")

        # Get the exam ID and student ID from the WebSocket URL
        self.exam_id = self.scope['url_route']['kwargs']['exam_id']
        self.student_id = self.scope['url_route']['kwargs']['student_id']

        # Create a unique WebSocket channel for this student
        self.channel_name = f'exam_{self.exam_id}_{self.student_id}'

        # Accept the WebSocket connection
        await self.accept()

        # Start the exam timer
        exam = await database_sync_to_async(self.get_exam)()
        self.remaining_time = exam.duration
        print(self.remaining_time)
        self.timer_task = asyncio.ensure_future(self.update_timer())

    def get_exam(self):
        # Get the exam object from the database
        return Exam.objects.get(id=self.exam_id)
        
    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        message = loads(text_data)
        message_type = message.get('type')

        if message_type == 'photo':
            # get the photo from the message
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
        
        elif message_type == 'start_exam':
            print("exam started")

    async def update_timer(self):
        # Update the remaining time and send updates to the client-side
        while int(self.remaining_time.total_seconds()) > 0:
            self.remaining_time -= timedelta(seconds=1)
            await asyncio.sleep(1)
            await self.send(dumps({
                'type': 'timer',
                'remaining_time': str(self.remaining_time)
            }))

        # End the exam session
        await self.send(dumps({
            'type': 'exam_ended'
        }))
        await self.close()
        await self.timer_task.cancel()