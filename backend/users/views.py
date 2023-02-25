from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

########################### Student Views ###########################

class StudentRegisterView(generics.CreateAPIView):
    # this view is responsible for registering a student
    # this will be edited to add student's photo
    queryset = Student.objects.all()
    serializer_class = StudentRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

########################### Examiner Views ###########################

class ExaminerRegisterView(generics.CreateAPIView):
    # this view is responsible for registering an examiner
    queryset = Examiner.objects.all()
    serializer_class = ExmainerRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        