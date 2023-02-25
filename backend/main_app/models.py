from django.apps import apps
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from datetime import datetime

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    examiner = models.ForeignKey('users.Examiner', on_delete=models.SET_NULL , null=True, related_name='courses')
    slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse("course", args = [self.slug])

class EnrollmentRequest(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    def save(self, *args, **kwargs):
        self.request_date = datetime.now()
        super().save(*args, **kwargs)


class EnrollmentDetail(models.Model):
    student = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now=False, auto_now_add=False)

class Exam(models.Model):
    # Exam Status field must be added
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams')
    exam_start_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    exam_end_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    duration = models.DurationField()
    max_grade = models.IntegerField()
    slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse("exam", args = [self.slug])


############### Old implementation of Question and Choice models ################
# class Question(models.Model):
#     question_text = models.TextField()
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
#     correct_answer = models.ForeignKey('Choice', on_delete=models.CASCADE, blank=True)
#     def __str__(self):
#         return self.question_text

    
# class Choice(models.Model):
#     choice_text = models.TextField()
#     parent_question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     def __str__(self):
#         return self.choice_text

############### New implementation of Question model ################

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question_text = models.TextField()
    marks = models.IntegerField()
    choice_1 = models.TextField()
    choice_2 = models.TextField()
    choice_3 = models.TextField()
    choice_4 = models.TextField()
    correct_answer = models.IntegerField()


class Attempt(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    grade = models.IntegerField()
    # Answers = models.TextField()
    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.student.name + " " + self.exam.name
    def calculate_grade(self):
        pass
    
class Answer(models.Model):
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.IntegerField()
    def __str__(self):
        return self.attempt.student.name + " " + self.attempt.exam.name + " " + self.question.question_text