import json
from django.apps import apps
from django.db import models
from datetime import datetime
from django.core.validators import MinValueValidator
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

# faster than the default JSONField
# from django.contrib.postgres.fields import JSONField

def get_id_from_email(email):
    return apps.get_model('users', 'User').objects.get(email=email).pk

class Course(models.Model):
    STATUS_CHOICES = (
        ('open', 'open'),
        ('closed', 'closed'),
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    examiner = models.ForeignKey('users.Examiner', on_delete=models.SET_NULL , null=True, related_name='courses')
    def __str__(self):
        return self.name

class EnrollmentRequest(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now=False, auto_now_add=False, default=datetime.now)

    # only one request per student per course
    class Meta:
        unique_together = ('student', 'course')

    def accept(self):
        EnrollmentDetail.objects.create(student=self.student, course=self.course, enrollment_date=datetime.now())
        self.delete()
    def reject(self):
        self.delete()

class EnrollmentDetail(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now=False, auto_now_add=False,default=datetime.now)

    # only one enrollment per student per course
    class Meta:
        unique_together = ('student', 'course')

class Exam(models.Model):
    # Exam Status field must be added
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams')
    exam_start_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    exam_end_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    duration = models.DurationField()
    max_grade = models.IntegerField(default=0)

    def update_max_grade(self):
        questions = Question.objects.filter(exam=self)
        grades = 0
        for question in questions:
            grades += question.marks
        self.max_grade = grades

    def __str__(self):
        return self.name

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question_text = models.TextField()
    marks = models.IntegerField(default=1)
    choices = models.JSONField(blank=True, default=dict)
    correct_answer = models.IntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return self.question_text
    
@receiver(post_save, sender=Question)
def update_exam_max_grade_on_save(sender, instance, created, **kwargs):
    if created:
        instance.exam.update_max_grade()
        instance.exam.save()
@receiver(post_delete, sender=Question)
def update_exam_max_grade_on_delete(sender, instance, **kwargs):
    instance.exam.update_max_grade()
    instance.exam.save()

class Attempt(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)
    grade = models.IntegerField(default=0)   

    # This is to make sure that a student can only attempt an exam once
    class Meta:
        unique_together = ('student', 'exam')

    def calculate_grade(self):
        marks = 0
        # Query all the answers for this attempt
        answers = Answer.objects.filter(attempt=self)
        for answer in answers:
            if answer.question.correct_answer == answer.choice:
                marks += answer.question.marks
        self.grade = marks

    def __str__(self):
        return f'{self.student_id} - {self.exam_id}'
    
class Answer(models.Model):
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.IntegerField(blank=True)

@receiver(post_save, sender=Answer)
def update_attempt_grade_on_save(sender, instance, created, **kwargs):
    if created:
        instance.attempt.calculate_grade()
        instance.attempt.save()