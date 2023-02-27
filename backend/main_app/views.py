from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


#################################### General Views ####################################

class CourseDetailView(generics.RetrieveAPIView):
    # this view is responsible for listing all details of a specific course except exams
    serializer_class = CourseSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Course.objects.filter(id=course_id)
        return None

class ExamDetailView(generics.RetrieveAPIView):
    # this view is responsible for listing all details of a specific exam except questions
    serializer_class = ExamSerializer
    lookup_url_kwarg = "exam_id"

    def get_queryset(self):
        exam_id = self.kwargs.get(self.lookup_url_kwarg)
        if exam_id is not None:
            return Exam.objects.filter(id=exam_id)
        return None


#################################### Student Views ####################################


class StudentCourseListView(generics.ListAPIView):
    # this view is responsible for listing all courses of a specific student
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        student_id = self.request.user.pk
        # profile_id = StudentProfile.objects.filter(user_id=student_id).values_list('id', flat=True)
        if student_id is not None:
            course_id = EnrollmentDetail.objects.filter(student_id=student_id).values_list('course', flat=True)
            return Course.objects.filter(id__in=course_id)
        return None

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

#class ExamStartView(APIView):

#class ExamReviewView(APIView):

#class ExamEndView(APIView):


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

class ExaminerExamListView(generics.ListAPIView):
    # this view is responsible for listing all exams of a specific course
    serializer_class = ExamSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Exam.objects.filter(course_id=course_id)
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

class EnrollmentRequestListView(generics.ListAPIView):
    # this view is responsible for listing all enrollment requests of a specific course
    # request_id also got to be sent
    serializer_class = EnrollmentRequestSerializer
    lookup_url_kwarg = "course_id"
    
    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return EnrollmentRequest.objects.filter(course_id=course_id)
        return None

class EnrollmentRequestAcceptView(APIView):
    # this view is responsible for accepting an enrollment request and creating new enrollment deatail instance
    lookup_url_kwarg = "request_id"

    def post(self, request, *args, **kwargs):
        # firstly, we get student_id and course_id from enrollment request
        request_id = self.kwargs.get(self.lookup_url_kwarg)
        enrollment_request = EnrollmentRequest.objects.filter(id=request_id).first()
        student_id = enrollment_request.student_id
        course_id = enrollment_request.course_id
        # then, we delete enrollment request
        enrollment_request.delete()
        # finally, we create new enrollment detail instance
        enrollment_detail = EnrollmentDetail.objects.create(student_id=student_id, course_id=course_id)
        enrollment_detail.save()
        return Response(status=status.HTTP_200_OK)

class EnrollmentRequestRejectView(generics.DestroyAPIView):
    # this view is responsible for rejecting an enrollment request
    lookup_url_kwarg = "request_id"

    def get_queryset(self):
        request_id = self.kwargs.get(self.lookup_url_kwarg)
        if request_id is not None:
            return EnrollmentRequest.objects.filter(id=request_id)
        return None

# class dealing with logs must be added