from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import UpdateModelMixin


#################################### Student Views ####################################


# class StudentCourseListView(generics.ListAPIView):
#     # first page after login
#     """
#     Lists all courses in DB
#     i don't know if this should return all courses or just courses related to specific examiner or student
#     or should we have many functions for those different cases?
#     """
#     #queryset = Student.objects.filter(id=1).enrolled_courses.all()
#     serializer_class = CourseSerializer

# class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
#     # here i want to return details of a specific requested course
#     # for student and examiner
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class CourseSearchView(APIView):

# class CourseEnrollmentView(generics.RetrieveUpdateDestroyAPIView):
    # check if we should check first if student is already enrolled in this course
    # if enrolled, return CourseDetailView

# class CourseJoinView(APIView):
#     # this view is responsible for joining a course by a student
#     permission_classes = (IsAuthenticated,)
#     lookup_url_kwarg = "course_id"

#     def post(self, request, format=None):
#         course_id = request.data.get(self.lookup_url_kwarg)
#         if course_id is not None:
#             course = Course.objects.filter(id=course_id).first()
#             if course is not None:
#                 course_owner_id = request.data.get("examiner_id") # or any other way to get course owner id
#                 student_id = request.data.get("student_id") # or any other way to get student id
#                 # Then the request must be added to the list of pending requests 
#                 # of the course owner
#                 return Response({'message':'Join Request is sent to the course owner'}, status=status.HTTP_200_OK)
#             return Response({
#                 'status': 'Not Found',
#                 'message': 'Course with id {} does not exist.'.format(course_id)
#             }, status=status.HTTP_404_NOT_FOUND)
#         return Response({
#             'status': 'Bad request',
#             'message': 'Course id was not provided.'
#         }, status=status.HTTP_400_BAD_REQUEST)

#class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    # differs according to exam's status

#class ExamStartView(APIView):

#class ExamReviewView(APIView):

#class ExamEndView(APIView):

#class dealing with adding photos after registration must be added



#################################### Examiner Views ####################################



class CourseCreateView(generics.CreateAPIView):
    # this view is responsible for creating a course
    permission_classes = (IsAuthenticated,)
    serializer_class = CourseCreateSerializer

class CourseEditView(generics.UpdateAPIView):
    # this view is responsible for editing a course
    serializer_class = CourseEditSerializer
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Course.objects.filter(id=pk)

class CourseDeleteView(generics.DestroyAPIView):
    # this view is responsible for deleting a course
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Course.objects.filter(id=pk)

class ExamCreateView(generics.CreateAPIView):
    # this view is responsible for creating an exam
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamCreateSerializer

    def perform_create(self, serializer):
        course_id = self.request.data.get('course_id')
        course = Course.objects.filter(id=course_id).first()
        serializer.save(course=course)

class ExamEditView(generics.UpdateAPIView):
    # this view is responsible for editing a course
    serializer_class = ExamEditSerializer
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Exam.objects.filter(id=pk)

class ExamDeleteView(generics.DestroyAPIView):
    # this view is responsible for deleting an exam
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Exam.objects.filter(id=pk)

class QuestionCreateView(generics.CreateAPIView):
    # this view is responsible for creating a question
    permission_classes = (IsAuthenticated,)
    serializer_class = QuestionCreateSerializer

    def perform_create(self, serializer):
        exam_id = self.request.data.get('exam_id')
        exam = Exam.objects.filter(id=exam_id).first()
        serializer.save(exam=exam)

class QuestionEditView(generics.UpdateAPIView):
    # this view is responsible for editing a question
    serializer_class = QuestionEditSerializer
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Question.objects.filter(id=pk)

class QuestionDeleteView(generics.DestroyAPIView):
    # this view is responsible for deleting a question
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return Question.objects.filter(id=pk)

class ExaminerCourseListView(generics.ListAPIView):
    # this view is responsible for listing all courses of a specific examiner
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.filter(examiner=self.request.user)

class ExaminerCourseDetailView(generics.RetrieveAPIView):
    # this view is responsible for listing all details of a specific course except exams
    serializer_class = CourseSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Course.objects.filter(id=course_id)
        return None

class ExaminerExamListView(generics.ListAPIView):
    # this view is responsible for listing all exams of a specific course
    serializer_class = ExamSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Exam.objects.filter(course_id=course_id)
        return None

class ExaminerExamDetailView(generics.RetrieveAPIView):
    # this view is responsible for listing all details of a specific exam except questions
    serializer_class = ExamSerializer
    lookup_url_kwarg = "exam_id"

    def get_queryset(self):
        exam_id = self.kwargs.get(self.lookup_url_kwarg)
        if exam_id is not None:
            return Exam.objects.filter(id=exam_id)
        return None

class ExaminerQuestionListView(generics.ListAPIView):
    # this view is responsible for listing all questions of a specific exam
    serializer_class = QuestionSerializer
    lookup_url_kwarg = "exam_id"

    def get_queryset(self):
        exam_id = self.kwargs.get(self.lookup_url_kwarg)
        if exam_id is not None:
            return Question.objects.filter(exam_id=exam_id)
        return None

class ExaminerCourseEnrollmentRequestsListView(generics.ListAPIView):
    serializer_class = CourseEnrollmentRequestSerializer
    lookup_url_kwarg = "course_id"
    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return EnrollmentRequest.objects.filter(course=course_id)
        return None
    # Only for retrieving requests
    # requests are not handeled yet

# class dealing with logs must be added