from django.shortcuts import render
from rest_framework import generics
from .serializers import ExaminerSerializer
from .models import Examiner


# Trying to create a new Examiner
class ExaminerView(generics.CreateAPIView):
    queryset = Examiner.objects.all()
    serializer_class = ExaminerSerializer

