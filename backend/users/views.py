from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

########################### Examiner Views ###########################

class ExaminerRegisterView(generics.CreateAPIView):
    # code needs to be more clean
    # this view is responsible for registering an examiner
    queryset = Examiner.objects.all()
    serializer_class = ExmainerRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

########################### Student Views ###########################


class StudentRegisterView(generics.CreateAPIView):
    # code needs to be more clean
    # this view is responsible for registering a student
    queryset = Student.objects.all()
    serializer_class = StudentRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class PhotoUploadView(APIView):
    # UPDATEAPI VIEW should be used here
    # this view is responsible for uploading student's photo
    permission_classes = (IsAuthenticated,)
    serializer_class = PhotoUploadSerializer

    def post(self, request, format=None):
        student_id = request.user.pk
        if student_id is not None:
            student = Student.objects.filter(id=student_id).first()
            student_profile = StudentProfile.objects.filter(user_id=student_id).first()
            if student is not None:
                serializer = self.serializer_class(data=request.data)
                if serializer.is_valid():
                    serializer.update(student_profile, serializer.validated_data)
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'status': 'Not Found',
                'message': 'Student with id {} does not exist.'.format(student_id)
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'status': 'Bad request',
            'message': 'Student id was not provided.'
        }, status=status.HTTP_400_BAD_REQUEST)