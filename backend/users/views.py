from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

########################### Student Views ###########################

class StudentRegisterView(generics.CreateAPIView):
    # this view is responsible for registering a student
    # this will be edited to add student's photo
    queryset = Student.objects.all()
    serializer_class = StudentRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class StudentLoginView(APIView):
#     # this view is responsible for logging in a student
#     def post(self, request, format=None):
#         email = request.data.get("email")
#         password = request.data.get("password")
#         user = Student.objects.filter(email=email).first()
#         ###
#         # Not working for some reason
#         # print("password check")
#         # print(user.check_password(password))
#         # user = authenticate(email=email, password=password)
#         # print("authenticate result")
#         # print(user)
#         ###
#         if user.check_password(password):
#             # login(request, user) # i think it works with sessions not tokens
#             return Response({'message':'Login Successful'}, status=status.HTTP_200_OK)

#         return Response({'message':'Login Failed'}, status=status.HTTP_400_BAD_REQUEST)
    

########################### Examiner Views ###########################

class ExaminerRegisterView(generics.CreateAPIView):
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

# class ExaminerLoginView(APIView):
#     # this view is responsible for logging in an examiner

#     def post(self, request, format=None):
#         email = request.data.get("email")
#         password = request.data.get("password")
#         user = Student.objects.filter(email=email).first()
#         # AUTHENTICATE IS NOT WORKING PROPERLY 
#         #  user = authenticate(email=email, password=password)
#         if user.check_password(password):
#             #login(request, user) # i think it works with sessions not tokens
#             return Response({'message':'Login Successful'}, status=status.HTTP_200_OK)

#         return Response({'message':'Login Failed'}, status=status.HTTP_400_BAD_REQUEST)