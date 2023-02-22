from django.urls import path
from .views import *

urlpatterns = [
    path("examinerregister", ExaminerRegisterView.as_view(), name="ExaminerRegister"),
    path("studentregister", StudentRegisterView.as_view(), name="StudentRegister"),
    path("courselist", CourseListView.as_view(), name="course"),
    path("coursejoin", JoinCourseView.as_view(), name="coursejoin"),

]