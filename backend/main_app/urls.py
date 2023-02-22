from django.urls import path
from .views import *

urlpatterns = [
    path("courselist", CourseListView.as_view(), name="course"),
    path("coursejoin", JoinCourseView.as_view(), name="coursejoin"),
]