from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *


# Trying to create a new Course
class CourseView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer