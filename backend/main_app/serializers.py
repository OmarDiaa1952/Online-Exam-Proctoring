from rest_framework import serializers
from .models import *

########################## Enrollment Serializers ##########################

class EnrollmentDetailSerializer(serializers.ModelSerializer):
    # used by EnrolledStudentListView
    student_name = serializers.CharField(source='student.user.get_full_name') 
    # i rememer concatinating first and full name manually before somewhere else, i need to change that
    student_email = serializers.CharField(source='student.user.email')
    class Meta:
        model = EnrollmentDetail
        fields = ("student_name", "student_email", "enrollment_date")

class EnrollmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentRequest
        fields = ("id","course_id", "student_id", "request_date")

class EnrollmentRequestActionSerializer(serializers.Serializer):
    # field with only two possible values
    action = serializers.ChoiceField(choices=["accept", "reject"])

    class Meta:
        fields = ("action",)

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentDetail
        fields = ("course_id", "student_id")

########################## Course Serializers ##########################

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description", "status", "examiner_id")

    def save(self, *args, **kwargs):
        pk = self.context['request'].user.pk
        self.validated_data['examiner_id'] = pk
        super().save(*args, **kwargs)

    def to_representation(self, instance):
        data = {"id": instance.id}
        return data

class CourseEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("name", "description", "status")

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

class CourseDetailSerializer(serializers.ModelSerializer):
    
    is_requested = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    examiner = serializers.SerializerMethodField()

    def get_is_requested(self, obj):
        pk = self.context['request'].user.pk
        return EnrollmentRequest.objects.filter(course_id=obj.id, student_id=pk).exists()
    
    def get_is_enrolled(self, obj):
        pk = self.context['request'].user.pk
        return EnrollmentDetail.objects.filter(course_id=obj.id, student_id=pk).exists()
    
    def get_examiner(self, obj):
        # get examiner first_name and last_name from course table using select related
        return obj.examiner.first_name + " " + obj.examiner.last_name

    class Meta:
        model = Course
        fields = ("id", "name", "description", "status", "examiner", "is_requested", "is_enrolled")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user_role = self.context['request'].user.role
        if user_role == "EXAMINER":
            data.pop("is_requested")
            data.pop("is_enrolled")
        return data

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "name")


########################## Exam Serializers ##########################


class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("id", "name", "description", "exam_start_date", "exam_end_date", "duration")
    # the accepted format for datetime is "YYYY-MM-DD HH:MM:SS"
    # the accepted format for duration is "HH:MM:SS"

    def create(self, validated_data):
        course_id = self.context['request'].data.get('course_id')
        course = Course.objects.filter(id=course_id).first()
        validated_data['course'] = course
        instance = super().create(validated_data)
        return instance
    
    def to_representation(self, instance):
        data = {"id": instance.id}
        return data


class ExamEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("name", "description", "exam_start_date", "exam_end_date", "duration")

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.exam_start_date = validated_data.get('exam_start_date', instance.exam_start_date)
        instance.exam_end_date = validated_data.get('exam_end_date', instance.exam_end_date)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.save()
        return instance
    
class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ("id", "name", "description", "exam_start_date", "exam_end_date", "duration", "max_grade", "course_id")



########################## Question Serializers ##########################


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("question_text", "marks", "choice_1", "choice_2", "choice_3", "choice_4", "correct_answer")

    def to_representation(self, instance):
        data = {"id": instance.id}
        return data

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
    
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "question_text", "marks", "choice_1", "choice_2", "choice_3", "choice_4", "correct_answer", "exam_id")


########################## Attempt Serializers ##########################

class QuestionViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "question_text", "marks", "choice_1", "choice_2", "choice_3", "choice_4", "correct_answer")

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionViewSerializer(read_only=True)
    class Meta:
        model = Answer
        fields = ("question", "choice")
        
class AttemptSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)    
    class Meta:
        model = Attempt
        fields = ("id", "exam_id", "student_id", "start_time", "submission_time", "grade", "answers")





# class AnswerCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answer
#         fields = ("question_id", "choice")

# class AttemptCreateSerializer(serializers.ModelSerializer):
#     answers = AnswerCreateSerializer(many=True)
#     class Meta:
#         model = Attempt
#         fields = ("exam_id", "student_id", "start_time", "submission_time", "answers")

#     def save(self, *args, **kwargs):
#         pk = self.context['request'].user.pk
#         self.validated_data['student_id'] = pk
#         for answer in self.validated_data['answers']:
#             a = Answer(question_id=answer['question_id'], choice=answer['choice'])

#         super().save(*args, **kwargs)

