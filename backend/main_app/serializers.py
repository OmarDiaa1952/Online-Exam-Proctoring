from rest_framework import serializers
from .models import *

class ExmainerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examiner
        fields = ("name", "email", "password")
    def create(self, validated_data):
        examiner = Examiner.objects.create(**validated_data)
        return examiner

class StudentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("name", "email", "password")
    def create(self, validated_data):
        student = Student.objects.create(**validated_data)
        return student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class ExaminerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examiner
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description", "examiner") #not sure of the examiner

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

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = "__all__"