from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response


# Trying to create a new Course
class CourseView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CreateCourseView(APIView):
    queryset = Course.objects.all()
    serializer_class = CreateCourseSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            examiner = serializer.data.get('examiner') # not sure how we will get the examiner
            course = Course(name=name, description=description, examiner=examiner)
            # check if room already exists before creating
            course.save()
            return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'Course could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST) 