from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


########################### General Views ###########################

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

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
    permission_classes = (IsAuthenticated,)
    serializer_class = PhotoUploadSerializer

    # gotta use get_object() instead of get_queryset() so lookup_field becomes unrequired
    def get_object(self):
        student_id = self.request.user.pk
        if student_id is not None:
            return StudentProfile.objects.filter(user_id=student_id).first()
        return None