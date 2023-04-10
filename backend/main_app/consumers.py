from json import loads, dumps
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Exam

class ExamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the exam ID and student ID from the WebSocket URL
        self.exam_id = self.scope['url_route']['kwargs']['exam_id']
        self.student_id = self.scope['url_route']['kwargs']['student_id']

        # Create a unique WebSocket channel for this student
        self.channel_name = f'exam_{self.exam_id}_{self.student_id}'

        # Accept the WebSocket connection
        await self.accept()

        # Start the exam timer
        exam = Exam.objects.get(id=self.exam_id)
        self.remaining_time = exam.duration * 60
        self.timer_task = self.channel_layer.periodic_task(1, self.update_timer)

    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        message = loads(text_data)
        message_type = message.get('type')

        if message_type == 'photo':
            # get the photo from the message
            photo_data = message.get('photo_data')
            # then i gotta decide what to do with the photo

    async def update_timer(self):
        # Update the remaining time and send updates to the client-side
        if self.remaining_time > 0:
            self.remaining_time -= 1
            await self.send(dumps({
                'type': 'timer',
                'remaining_time': self.remaining_time
            }))
        else:
            # End the exam session
            await self.send(dumps({
                'type': 'exam_ended'
            }))
            await self.timer_task.cancel()