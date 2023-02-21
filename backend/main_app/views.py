from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response


class CourseListView(generics.ListCreateAPIView): 
    """
    Lists all courses in DB
    i don't know if this should return all courses or just courses related to specific examiner or student
    or should we have many functions for those different cases?
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    # here i want to return details of a specific requested course
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CreateCourseView(APIView): 
    # this view is responsible for creating a new course by the examiner
    queryset = Course.objects.all()
    serializer_class = CreateCourseSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            examiner = serializer.data.get('examiner') # not sure how we will get the examiner
            course = Course(name=name, description=description, examiner=examiner)
            # check if course already exists before creating
            course.save()
            return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED) # returning created course data
        return Response({
            'status': 'Bad request',
            'message': 'Course could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST) 
    
class ExamListView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class CreateExamView(APIView):
    queryset = Exam.objects.all()
    serializer_class = CreateExamSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            course = serializer.data.get('course')
            exam_start_date = serializer.data.get('exam_start_date')
            exam_end_date = serializer.data.get('exam_end_date')
            duration = serializer.data.get('duration')
            max_grade = serializer.data.get('max_grade')
            exam = Exam(name=name, description=description, course=course, exam_start_date=exam_start_date, exam_end_date=exam_end_date, duration=duration, max_grade=max_grade)
            # check if exam already exists before creating
            exam.save()
            return Response(ExamSerializer(exam).data, status=status.HTTP_201_CREATED) # returning created exam data
        return Response({
            'status': 'Bad request',
            'message': 'Exam could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)