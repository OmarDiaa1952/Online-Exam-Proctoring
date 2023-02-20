from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response


# Trying to create a new Course
class CourseView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer