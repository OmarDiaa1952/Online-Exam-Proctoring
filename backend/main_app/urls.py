from django.urls import path
from .views import *

urlpatterns = [
    path("", ExaminerView.as_view(), name="examiner"),
]