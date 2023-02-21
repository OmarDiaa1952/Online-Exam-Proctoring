from django.urls import path
from .views import *

urlpatterns = [
    path("courselist", CourseListView.as_view(), name="course"),
]