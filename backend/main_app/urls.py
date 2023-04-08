from django.urls import path
from .views import *



urlpatterns = [

    ################### General URLs ###################
    
    path("courselist", CourseListView.as_view(), name="courselist"),
    path("coursedetail/<int:course_id>", CourseDetailView.as_view(), name="coursedetail"),
    # path("coursesearch", CourseSearchView.as_view(), name="coursesearch"),
    # path("coursesearch/<str:search_query>", CourseSearchView.as_view(), name="coursesearch"),
    path("examlist/<int:course_id>", ExamListView.as_view(), name="examlist"),
    path("examdetail/<int:exam_id>", ExamDetailView.as_view(), name="examdetail"),
    path("questionlist/<int:exam_id>", QuestionListView.as_view(), name="questionlist"),

    ################### Examiner URLs ###################

    path("coursecreate", CourseCreateView.as_view(), name="createcourse"),
    path("courseedit/<int:pk>", CourseEditView.as_view(), name="editcourse"),
    path("coursedelete/<int:pk>", CourseDeleteView.as_view(), name="deletecourse"),
    path("examcreate", ExamCreateView.as_view(), name="createexam"),
    path("examedit/<int:pk>", ExamEditView.as_view(), name="editexam"),
    path("examdelete/<int:pk>", ExamDeleteView.as_view(), name="deleteexam"),
    path("questioncreate", QuestionCreateView.as_view(), name="createquestion"),
    path("questionedit/<int:pk>", QuestionEditView.as_view(), name="editquestion"),
    path("questiondelete/<int:pk>", QuestionDeleteView.as_view(), name="deletequestion"),
    path("enrolledstudentlist/<int:course_id>", EnrolledStudentListView.as_view(), name="enrolledstudentlist"),
    path("enrollmentrequestlist/<int:course_id>", EnrollmentRequestListView.as_view(), name="enrollmentrequestlist"),
    path("enrollmentrequestaction/<int:request_id>", EnrollmentRequestActionView.as_view(), name="enrollmentrequestaction"),
    path("enrollmentcreate/<int:course_id>", EnrollmentCreateView.as_view(), name="createenrollment"),
    
    ################### Student URLs ###################
    
    path("coursejoin/<int:course_id>", CourseJoinView.as_view(), name="coursejoin"),
    path("examreview/<int:exam_id>", ExamReviewView.as_view(), name="examreview"),
    path("examend", ExamEndView.as_view(), name="examend")
]