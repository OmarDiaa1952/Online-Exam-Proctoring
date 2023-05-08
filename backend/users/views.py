import os
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

class PhotoUploadView(generics.UpdateAPIView):
    # this view is responsible for uploading student's photo
    permission_classes = (IsStudent,)

    # gotta use get_object() instead of get_queryset() so lookup_field becomes unrequired
    def get_object(self):
        student_id = self.request.user.pk
        if student_id is not None:
            return StudentProfile.objects.filter(user_id=student_id).first()
        return None
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # extract the base64-encoded string from the request data
        photo_data = request.data.get('photo')
        
        # decode the base64-encoded string to binary data
        if photo_data is not None:
            format, imgstr = photo_data.split(';base64,') 
            ext = format.split('/')[-1] 
            data = ContentFile(base64.b64decode(imgstr), name=f"{instance.user.username}.{ext}")
            instance.photo = data
            instance.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
class VideoUploadView(APIView):
    # this view is responsible for uploading student's video
    permission_classes = (IsStudent,)

    def post(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is not None:
            video = request.data.get('video')
            # save video in txt file in media directory
            with open(f"media/videos/user_{student_id}/{student_id}.txt", "w", encoding="utf-8") as f:
                # if not created already, create a directory for the student
                if not os.path.exists(f"media/videos/user_{student_id}"):
                    os.makedirs(f"media/videos/user_{student_id}")
                f.write(video)
            if video is not None:
                # save video in media directory
                with open(f"media/videos/user_{student_id}/{student_id}.mp4", "wb") as f:
                    f.write(video.read())
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class PhotoRetrieve(APIView):
    # this view is responsible for retrieving student's photo
    permission_classes = (IsStudent,)

    def get(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is not None:
            photo = StudentProfile.objects.get(user_id=student_id).photo
            if photo:
                with open(photo.path, "rb") as f:
                    photo_data = f.read()
                    base64_encoded_data = base64.b64encode(photo_data).decode('utf-8')
                    return Response({"photo": f"data:image/png;base64,{base64_encoded_data}"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
class PhotoExistsView(generics.RetrieveAPIView):
    # this view is responsible for checking if student has a photo
    permission_classes = (IsStudent,)
    serializer_class = PhotoExistsSerializer

    def get_object(self):
        student_id = self.request.user.pk
        if student_id is not None:
            return StudentProfile.objects.filter(user_id=student_id).first()
        return None