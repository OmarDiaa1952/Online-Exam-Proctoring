from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("userdata", UserDataView.as_view(), name="UserData"),
    path("examinerregister", ExaminerRegisterView.as_view(), name="ExaminerRegister"),
    path("studentregister", StudentRegisterView.as_view(), name="StudentRegister"),
    path("photoupload", PhotoUploadView.as_view(), name="PhotoUpload"),
    path("photoretrieve", PhotoRetrieve.as_view(), name="PhotoRetrieve"),
    path("photoexists", PhotoExistsView.as_view(), name="PhotoExists"),
    path("videoupload", VideoUploadView.as_view(), name="VideoUpload"),
    path("videoexists", VideoExistsView.as_view(), name="VideoExists"),
]