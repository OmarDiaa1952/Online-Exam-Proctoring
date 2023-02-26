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
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.save()
        return instance   


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = "__all__"

class CreateExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("name", "description", "course", "exam_start_date", "exam_end_date", "duration", "max_grade")

# class EnrollmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Enrollment
#         fields = "__all__"

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"

# class ChoiceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Choice
#         fields = "__all__"

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = "__all__"

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"

class EnrollmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentRequest
        fields = "__all__"