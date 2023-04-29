from django.urls import re_path

from .consumers import ExamConsumer

websocket_urlpatterns = [
    re_path(r'ws/exam/(?P<exam_id>\d+)/$', ExamConsumer.as_asgi()),
]