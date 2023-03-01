from django.urls import path
from .views import *



urlpatterns = [

    ################### General URLs ###################

    path("coursedetail/<int:course_id>", CourseDetailView.as_view(), name="coursedetail"),
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
    path("examinercourselist", ExaminerCourseListView.as_view(), name="examinercourselist"),
    path("enrollmentrequestlist/<int:course_id>", EnrollmentRequestListView.as_view(), name="enrollmentrequestlist"),
    path("enrollmentrequestaction/<int:request_id>", EnrollmentRequestActionView.as_view(), name="enrollmentrequestaction"),
    # path("enrollmentrequestaccept/<int:request_id>", EnrollmentRequestAcceptView.as_view(), name="enrollmentrequestaccept"),
    # path("enrollmentrequestreject/<int:request_id>", EnrollmentRequestRejectView.as_view(), name="enrollmentrequestreject"),
    
    ################### Student URLs ###################
    
    path("studentcourselist", StudentCourseListView.as_view(), name="studentcourselist"),
    path("coursesearch/<str:search_query>", CourseSearchView.as_view(), name="coursesearch"),
    path("coursejoin/<int:course_id>", CourseJoinView.as_view(), name="coursejoin"),
    path("examreview/<int:exam_id>", ExamReviewView.as_view(), name="examreview"),
    path("examend", ExamEndView.as_view(), name="examend")
]