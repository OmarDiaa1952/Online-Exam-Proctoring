from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("examinerregister", ExaminerRegisterView.as_view(), name="ExaminerRegister"),
    path("studentregister", StudentRegisterView.as_view(), name="StudentRegister"),
    path("examinerlogin", ExaminerLoginView.as_view(), name="ExaminerLogin"),
    path("studentlogin", StudentLoginView.as_view(), name="StudentLogin"),
]