from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

#################################### General Views ####################################

class CourseListView(generics.ListAPIView):
    search_fields = ['id','name']
    filter_backends = (filters.SearchFilter,)
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        user_id = self.request.user.pk
        user_role = self.request.user.role
        all = self.request.query_params.get('all')
        if all is not None:
            print(all)
            return Course.objects.all()
        if user_role == "STUDENT":
            # this has to be just one query but this is
            # a turnaround as student model is in another app
            course_id = EnrollmentDetail.objects.filter(student_id=user_id).values_list('course', flat=True)
            return Course.objects.filter(id__in=course_id)
        return Course.objects.filter(examiner_id=user_id)

class CourseDetailView(generics.RetrieveAPIView):
    # this view is responsible for listing all details of a specific course except exams
    serializer_class = CourseDetailSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Course.objects.filter(id=course_id)
        return None

class ExamListView(generics.ListAPIView):
    # this view is responsible for listing all exams of a specific course
    serializer_class = ExamSerializer
    lookup_url_kwarg = "course_id"

    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return Exam.objects.filter(course_id=course_id)
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
    
class QuestionListView(generics.ListAPIView):
    # this view is responsible for listing all questions of a specific exam
    # called when examiner views exam details
    # or when a student starts the exam
    serializer_class = QuestionSerializer
    lookup_url_kwarg = "exam_id"

    def get_queryset(self):
        exam_id = self.kwargs.get(self.lookup_url_kwarg)
        if exam_id is not None:
            return Question.objects.filter(exam_id=exam_id)
        return None

#################################### Student Views ####################################

class CourseJoinView(generics.CreateAPIView):
    # this view is responsible for enrolling a student in a course
    permission_classes = (IsAuthenticated,)
    serializer_class = EnrollmentRequestSerializer
    lookup_url_kwarg = "course_id"

    def perform_create(self, serializer):
        student_id = self.request.user.pk
        serializer.save(student_id=student_id, course_id=self.kwargs.get(self.lookup_url_kwarg))

class ExamReviewView(generics.RetrieveAPIView):
    # retrieves the attempt and answers of a student for a specific exam
    serializer_class = AttemptSerializer
    lookup_url_kwarg = "exam_id"
    permission_classes = (IsAuthenticated,)
    def retrieve(self, request, *args, **kwargs):
        student_id = self.request.user.id
        exam_id = self.kwargs.get('exam_id')
        if student_id is not None and exam_id is not None:
            the_attempt = Attempt.objects.filter(student_id=student_id, exam_id=exam_id).first()
            serializer = self.get_serializer(the_attempt)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Missing student_id or exam_id parameters'}, status=status.HTTP_400_BAD_REQUEST)

# This class is very ugly, I know. I will refactor it later
class ExamEndView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, format=None):
        try:
            student_id = self.request.user.pk
            exam_id = request.data['exam_id']
            start_time = request.data['start_time']
            submission_time = request.data['submission_time']
            answers = request.data['answers']
            attempt = Attempt.objects.create(student_id=student_id, exam_id=exam_id, start_time=start_time, submission_time=submission_time)
            attempt_id = attempt.id
            for answer in answers:
                Answer.objects.create(attempt_id=attempt_id, question_id=answer['question_id'], choice=answer['choice'])
            attempt.calculate_grade()
            if attempt is not None:
                return Response(request.data ,status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

class EnrolledStudentListView(generics.ListAPIView):
    # this view is responsible for listing all enrolled students of a specific course
    serializer_class = EnrollmentDetailSerializer
    lookup_url_kwarg = "course_id"
    
    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return EnrollmentDetail.objects.filter(course_id=course_id)
        return None

class EnrollmentRequestListView(generics.ListAPIView):
    # this view is responsible for listing all enrollment requests of a specific course
    serializer_class = EnrollmentRequestSerializer
    lookup_url_kwarg = "course_id"
    
    def get_queryset(self):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        if course_id is not None:
            return EnrollmentRequest.objects.filter(course_id=course_id)
        return None

class EnrollmentRequestActionView(APIView):
    # this view is responsible for accepting or rejecting an enrollment request
    lookup_url_kwarg = "request_id"
    serializer_class = EnrollmentRequestActionSerializer

    def put(self, request, *args, **kwargs):
        request_id = self.kwargs.get(self.lookup_url_kwarg)
        action = request.data.get('action')
        serializer = self.serializer_class(data=request.data)
        enrollment_request = EnrollmentRequest.objects.filter(id=request_id).first()
        if enrollment_request is None:
            return Response("request_id {0} is not correct".format(request_id),status=status.HTTP_404_NOT_FOUND)
        if serializer.is_valid():
            if action == 'accept':
                enrollment_request.accept()
                return Response(serializer.data,status=status.HTTP_200_OK)
            elif action == 'reject':
                enrollment_request.reject()
                return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class EnrollmentCreateView(generics.CreateAPIView):
    # this view is responsible for creating an enrollment
    # by the examiner inserting the student's email
    permission_classes = (IsAuthenticated,)
    serializer_class = EnrollmentCreateSerializer
    lookup_url_kwarg = "course_id"

    def perform_create(self, serializer):
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        student_email = self.request.data.get('student_email')
        student_id = get_id_from_email(student_email)
        serializer.save(course_id=course_id, student_id=student_id)

# class dealing with logs must be added