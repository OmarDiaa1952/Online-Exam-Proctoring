from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *


# Trying to create a new Examiner
class ExaminerView(generics.CreateAPIView):
    queryset = Examiner.objects.all()
    serializer_class = ExaminerSerializer

