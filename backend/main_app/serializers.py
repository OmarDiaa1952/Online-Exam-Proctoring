from rest_framework import serializers
from .models import *

class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description", "examiner_id")

class CourseEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description")

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("name", "description", "exam_start_date", "exam_end_date", "duration", "max_grade")
    
    # the accepted format for datetime is "YYYY-MM-DD HH:MM:SS"
    # the accepted format for duration is "HH:MM:SS"

class ExamEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("name", "description", "exam_start_date", "exam_end_date", "duration", "max_grade")

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.exam_start_date = validated_data.get('exam_start_date', instance.exam_start_date)
        instance.exam_end_date = validated_data.get('exam_end_date', instance.exam_end_date)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.max_grade = validated_data.get('max_grade', instance.max_grade)
        instance.save()
        return instance