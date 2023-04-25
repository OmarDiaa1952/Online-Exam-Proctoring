from django.http import HttpResponse
from rest_framework import generics, status
from .serializers import *
from .models import *
from .permissions import IsStudent
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


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
    serializer_class = PhotoSerializer

    # gotta use get_object() instead of get_queryset() so lookup_field becomes unrequired
    def get_object(self):
        student_id = self.request.user.pk
        if student_id is not None:
            return StudentProfile.objects.filter(user_id=student_id).first()
        return None

class PhotoRetrieve(APIView):
    # this view is responsible for retrieving student's photo
    permission_classes = (IsStudent,)

    def get(self, request, format=None):
        student_id = self.request.user.pk
        if student_id is not None:
            photo = StudentProfile.objects.get(user_id=student_id).photo
            return HttpResponse(photo, content_type="image/png", status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)