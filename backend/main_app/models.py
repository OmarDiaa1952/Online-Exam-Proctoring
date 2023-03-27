from django.apps import apps
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from datetime import datetime
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    examiner = models.ForeignKey('users.Examiner', on_delete=models.SET_NULL , null=True, related_name='courses')
    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    # def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
    #     self.slug = slugify(self.name)
    #     super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("course", args = [self.slug])

class EnrollmentRequest(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now=False, auto_now_add=False, default=datetime.now)

    def accept(self):
        EnrollmentDetail.objects.create(student=self.student, course=self.course, enrollment_date=datetime.now())
        self.delete()
    def reject(self):
        self.delete()


class EnrollmentDetail(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now=False, auto_now_add=False,default=datetime.now)

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
    
    # cannot make slug unique on adding two exams of the same name

    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    # def save(self, *args, **kwargs):
    #     self.max_grade = self.calculate_max_grade()
    #     super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("exam", args = [self.slug])

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question_text = models.TextField()
    marks = models.IntegerField(default=1)
    choice_1 = models.TextField(blank=True)
    choice_2 = models.TextField(blank=True)
    choice_3 = models.TextField(blank=True)
    choice_4 = models.TextField(blank=True)
    correct_answer = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(4)])

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
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    grade = models.IntegerField(default=0)
    # Answers = models.TextField()
    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL     
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