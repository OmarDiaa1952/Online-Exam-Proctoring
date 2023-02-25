from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



#################################### Student Views ####################################


class StudentCourseListView(generics.ListAPIView):
    # first page after login
    """
    Lists all courses in DB
    i don't know if this should return all courses or just courses related to specific examiner or student
    or should we have many functions for those different cases?
    """
    #queryset = Student.objects.filter(id=1).enrolled_courses.all()
    serializer_class = CourseSerializer

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    # here i want to return details of a specific requested course
    # for student and examiner
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

# class CourseSearchView(APIView):

# class CourseEnrollmentView(generics.RetrieveUpdateDestroyAPIView):
    # check if we should check first if student is already enrolled in this course
    # if enrolled, return CourseDetailView

class CourseJoinView(APIView):
    # this view is responsible for joining a course by a student
    permission_classes = (IsAuthenticated,)
    lookup_url_kwarg = "course_id"

    def post(self, request, format=None):
        course_id = request.data.get(self.lookup_url_kwarg)
        if course_id is not None:
            course = Course.objects.filter(id=course_id).first()
            if course is not None:
                course_owner_id = request.data.get("examiner_id") # or any other way to get course owner id
                student_id = request.data.get("student_id") # or any other way to get student id
                # Then the request must be added to the list of pending requests 
                # of the course owner
                return Response({'message':'Join Request is sent to the course owner'}, status=status.HTTP_200_OK)
            return Response({
                'status': 'Not Found',
                'message': 'Course with id {} does not exist.'.format(course_id)
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'status': 'Bad request',
            'message': 'Course id was not provided.'
        }, status=status.HTTP_400_BAD_REQUEST)

#class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    # differs according to exam's status

#class ExamStartView(APIView):

#class ExamReviewView(APIView):

#class ExamEndView(APIView):

#class dealing with adding photos after registration must be added



#################################### Examiner Views ####################################



class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CreateCourseSerializer

    def post(self, request, format=None):
        examiner_id = request.user.pk
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(
                examiner_id=examiner_id
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class CourseEditView(generics.RetrieveUpdateDestroyAPIView):

class ExamCreateView(APIView):
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
    
#class ExamEditView(generics.RetrieveUpdateDestroyAPIView):

#class ExamDeleteView(generics.RetrieveUpdateDestroyAPIView):

# class EnrollmentRequestListView(generics.ListAPIView):
#     # this view is responsible for listing all pending enrollment requests
#     # for a specific course
#     serializer_class = EnrollmentRequestSerializer
#     lookup_url_kwarg = "course_id"

#     def get_queryset(self):
#         course_id = self.kwargs.get(self.lookup_url_kwarg)
#         if course_id is not None:
#             return EnrollmentRequest.objects.filter(course_id=course_id)
#         return None
    
#     def accept_enrollment_request(self, request, format=None):
#         # this view is responsible for accepting a specific enrollment request
#         # for a specific course
#         # this view is called from EnrollmentRequestDetailView
#         # this view must add the student to the course's students list
#         pass

#     def reject_enrollment_request(self, request, format=None):
#         # this view is responsible for rejecting a specific enrollment request
#         # for a specific course
#         # this view is called from EnrollmentRequestDetailView
#         # this view must delete the enrollment request
#         pass

# class dealing with logs must be added