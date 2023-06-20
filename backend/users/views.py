import os
from django.conf import settings
from django.http import HttpResponse
from rest_framework import generics, status
from .serializers import *
from .models import *
from .permissions import IsStudent
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.core.files.base import ContentFile
import base64

########################### General Views ###########################

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserDataView(generics.RetrieveAPIView):
    # this view is responsible for retrieving user's data
    permission_classes = (IsAuthenticated,)
    serializer_class = UserDataSerializer

    def get_object(self):
        user_id = self.request.user.pk
        if user_id is not None:
            return User.objects.get(id=user_id)
        return None

########################### Examiner Views ###########################

class ExaminerRegisterView(generics.CreateAPIView):
    # this view is responsible for registering an examiner
    queryset = Examiner.objects.all()
    serializer_class = ExmainerRegisterSerializer
        
########################### Student Views ###########################

class StudentRegisterView(generics.CreateAPIView):
    # this view is responsible for registering a student
    queryset = Student.objects.all()
    serializer_class = StudentRegisterSerializer   

class PhotoUploadView(APIView):
    # this view is responsible for uploading student's photo
    permission_classes = (IsStudent,)

    def post(self, request, format=None):
        Student_id = self.request.user.pk
        username = self.request.user.username
        if Student_id is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        photo = request.data.get('photo')
        if photo is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        format, imgstr = photo.split(';base64,')
        ext = format.split('/')[-1]
        data = base64.b64decode(imgstr)

        # construct the path to the media directory
        media_root = settings.MEDIA_ROOT
        media_dir = os.path.join(media_root, "profile_pics", f"user_{Student_id}")
        os.makedirs(media_dir, exist_ok=True)

        # save the photo to the media directory
        filename = os.path.join(media_dir, f"{username}.{ext}")
        with open(filename, 'wb') as f:
            f.write(data)
        return Response(status=status.HTTP_201_CREATED)
    
class RegistrationVideoUploadView(APIView):
    # this view is responsible for uploading student's video
    permission_classes = (IsStudent,)

    def post(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is not None:
            base64_video = request.data.get('video')
            if base64_video is not None:
                # decode the base64-encoded video data
                format, base64_video = base64_video.split(';base64,')
                ext = format.split('/')[-1]
                video_data = base64.b64decode(base64_video)

                # construct the path to the media directory
                media_root = settings.MEDIA_ROOT
                media_dir = os.path.join(media_root, "videos", "registration", f"user_{student_id}")
                os.makedirs(media_dir, exist_ok=True)
                
                # save the video to the media directory
                filename = os.path.join(media_dir, f"{student_id}.{ext}")
                with open(filename, 'wb') as f:
                    f.write(video_data)
                
                # return a response with status code 200
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

class PhotoRetrieve(APIView):
    # this view is responsible for retrieving student's photo
    permission_classes = (IsStudent,)

    def get(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        username = self.request.user.username

        # construct the path to the media directory
        media_root = settings.MEDIA_ROOT
        media_dir = os.path.join(media_root, "profile_pics", f"user_{student_id}")
        
        # read the photo file and encode it to base64
        filename = os.path.join(media_dir, f"{username}.jpeg")
        with open(filename, "rb") as f:
            photo_data = f.read()
            base64_encoded_data = base64.b64encode(photo_data).decode('utf-8')
            return Response({"photo": f"data:image/jpeg;base64,{base64_encoded_data}"}, status=status.HTTP_200_OK)
    
class PhotoExistsView(APIView):
    # this view is responsible for checking if student has a photo
    permission_classes = (IsStudent,)
    
    # check if student has a photo by checking if the photo file exists in the media directory
    def get(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # get the username of the student
        username = self.request.user.username

        # construct the path to the media directory
        media_root = settings.MEDIA_ROOT
        media_dir = os.path.join(media_root, "profile_pics", f"user_{student_id}")
        filename = os.path.join(media_dir, f"{username}.jpeg")

        # return a response with status code 200 if the photo file exists
        if os.path.exists(filename):
            return Response({
                "photo_exists": True
            },status=status.HTTP_200_OK)
        return Response({
            "photo_exists": False
        },status=status.HTTP_200_OK)

class VideoExistsView(APIView):
    # this view is responsible for checking if student has a video
    permission_classes = (IsStudent,)

    # check if student has a video by checking if the video file exists in the media directory
    def get(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is not None:
            media_root = settings.MEDIA_ROOT
            media_dir = os.path.join(media_root, "videos", "registration", f"user_{student_id}")
            filename = os.path.join(media_dir, f"{student_id}.webm")
            if os.path.exists(filename):
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)