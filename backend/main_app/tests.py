from django import utils
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
import json, websocket, jwt
from users.models import User
from .models import Exam

class ExamStartViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.exam_create_url = reverse('createexam')
        self.course_create_url = reverse('createcourse')
        self.auth_url = reverse('token_obtain_pair')
        self.username = "test"
        self.password = "test"
        self.email = "test@mail.com"

        #Create a new user object
        user = User.objects.create_user(username=self.username,
                                        password=self.password,
                                        email=self.email)

        # Save the user object to the database
        user.save()

        # Retrieve the user object from the database
        user = User.objects.get(username='test')

        auth_response = self.client.post(self.auth_url, {
            'username': self.username,
            'password': self.password,},
            format='json',)
        self.jwt_token = auth_response.data['access']

        # decoding the token
        self.decoded_payload = jwt.decode(self.jwt_token,
                                     algorithms=['HS256'],
                                     options={'verify_signature': False})
        
        # creating the course
        course = self.client.post(
            self.course_create_url,
            HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}',
            data=json.dumps({
                'name': 'test_course',
                'description': 'test',
            }),
            content_type='application/json',
        )

        # creating the exam
        exam = self.client.post(
            self.exam_create_url,
            HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}',
            data=json.dumps({
                'name': 'test_exam',
                'description': 'test',
                'duration': 15,
                'exam_start_date': utils.timezone.now().isoformat(),
                'exam_end_date': utils.timezone.now().isoformat(),
                'course_id': course.data['id'],
            }),
            content_type='application/json',
        )
        self.exam_id = exam.data['id']

        # url of this class
        self.url = reverse('examstart', args=[self.exam_id])
    
    def test_exam(self):
        exam = Exam.objects.get(id=self.exam_id)
        self.assertEqual(exam.name, 'test_exam')
    
    def test_websocket_connection(self):
        # Make a request to the ExamStartView URL
        response = self.client.get(
            self.url,
            HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}',
            content_type='application/json',
            )
        print(response.data)
        self.assertEqual(response.status_code, 200)

        # Create a WebSocket connection to the same URL
        ws = websocket.WebSocketApp(f"ws://localhost:8000/ws/exam/{self.exam_id}/{self.decoded_payload['user_id']}/",
                                    on_message=self.on_message,
                                    on_error=self.on_error,
                                    on_close=self.on_close)
        ws.on_open = self.on_open
        ws.run_forever()

    def on_open(self, ws):
        # Send a message to start the exam
        message = {'type': 'start_exam'}
        ws.send(json.dumps(message))

    def on_message(self, ws, message):
        # Handle incoming WebSocket messages
        print(f"Received message: {message}")

    def on_error(self, ws, error):
        # Handle WebSocket errors
        print(f"Error: {error}")

    def on_close(self, ws, close_status_code, close_msg):
        # Handle WebSocket close events
        print(f"WebSocket closed: {close_status_code} - {close_msg}")