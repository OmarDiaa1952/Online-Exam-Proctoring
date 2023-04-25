from datetime import timedelta
from json import loads, dumps
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Exam
from asgiref.sync import sync_to_async
import asyncio
from channels.db import database_sync_to_async

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
            # then i gotta decide what to do with the photo

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