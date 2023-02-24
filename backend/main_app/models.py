from django.apps import apps
from django.db import models
from django.urls import reverse
from django.utils.text import slugify

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

# class Enrollment(models.Model):
#     student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)
#     enrollment_date = models.DateTimeField(auto_now=False, auto_now_add=False)
#     slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
#     def __str__(self):
#         return self.student.name + " " + self.course.name
#     def get_absolute_url(self):
#         return reverse("enrollment", args = [self.slug])

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
    
class Question(models.Model):
    question_text = models.TextField()
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    correct_answer = models.CharField(max_length=1)
    def __str__(self):
        return self.question_text

    
class Choice(models.Model):
    choice_text = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_number = models.CharField(max_length=1)
    def __str__(self):
        return self.choice_text

    
class Attempt(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    grade = models.IntegerField()
    Answers = models.TextField()
    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.student.name + " " + self.exam.name