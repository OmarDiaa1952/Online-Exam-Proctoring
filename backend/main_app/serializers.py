from rest_framework import serializers
from .models import *

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description", "examiner_id")

    def save(self, *args, **kwargs):
        pk = self.context['request'].user.pk
        self.validated_data['examiner_id'] = pk
        super().save(*args, **kwargs)

class CourseEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description")

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "name", "description", "examiner_id")

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
    
class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("question_text", "marks", "choice_1", "choice_2", "choice_3", "choice_4", "correct_answer")

class QuestionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("question_text", "marks", "choice_1", "choice_2", "choice_3", "choice_4", "correct_answer")

    def update(self, instance, validated_data):
        instance.question_text = validated_data.get('question_text', instance.question_text)
        instance.marks = validated_data.get('marks', instance.marks)
        instance.choice_1 = validated_data.get('choice_1', instance.choice_1)
        instance.choice_2 = validated_data.get('choice_2', instance.choice_2)
        instance.choice_3 = validated_data.get('choice_3', instance.choice_3)
        instance.choice_4 = validated_data.get('choice_4', instance.choice_4)
        instance.correct_answer = validated_data.get('correct_answer', instance.correct_answer)
        instance.save()
        return instance
    