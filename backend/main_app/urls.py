from django.urls import path
from .views import *



urlpatterns = [
    path("coursecreate", CourseCreateView.as_view(), name="createcourse"),
    path("courseedit/<int:pk>", CourseEditView.as_view(), name="editcourse"),
    path("coursedelete/<int:pk>", CourseDeleteView.as_view(), name="deletecourse"),
    path("examcreate", ExamCreateView.as_view(), name="createexam"),
    path("examedit/<int:pk>", ExamEditView.as_view(), name="editexam"),
    path("examdelete/<int:pk>", ExamDeleteView.as_view(), name="deleteexam"),
    path("questioncreate", QuestionCreateView.as_view(), name="createquestion"),
    path("questionedit/<int:pk>", QuestionEditView.as_view(), name="editquestion"),
    path("questiondelete/<int:pk>", QuestionDeleteView.as_view(), name="deletequestion"),
    # path("courselist", StudentCourseListView.as_view(), name="course"),
    # path("coursedetail", CourseDetailView.as_view(), name="coursedetail"),
    # path("coursesearch", CourseSearchView.as_view(), name="coursesearch"),
    # path("courseenrollment", CourseEnrollmentView.as_view(), name="courseenrollment"),
    # path("coursejoin", CourseJoinView.as_view(), name="coursejoin"),
    # path("examdetail", ExamDetailView.as_view(), name="examdetail"),
    # path("examstart", ExamStartView.as_view(), name="examstart"),
    # path("examreview", ExamReviewView.as_view(), name="examreview"),
    # path("examend", ExamEndView.as_view(), name="examend")
]