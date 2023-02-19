from django.db import models
from django.urls import reverse

class Student(models.Model): 
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) # In case we want to use the slug in the URL, otherwise delete
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse("student", args = [self.slug])

class Examiner(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse("examiner", args = [self.slug])

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    examiner = models.ForeignKey(Examiner, on_delete=models.CASCADE)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse("course", args = [self.slug])

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.student.name + " " + self.course.name
    def get_absolute_url(self):
        return reverse("enrollment", args = [self.slug])

class Exam(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    exam_start_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    exam_end_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    duration = models.DurationField()
    max_grade = models.IntegerField()
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse("exam", args = [self.slug])
    
class Question(models.Model):
    question_text = models.TextField()
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    correct_answer = models.CharField(max_length=1)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.question
    def get_absolute_url(self):
        return reverse("question", args = [self.slug])
    
class Choice(models.Model):
    choice_text = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_number = models.CharField(max_length=1)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.choice
    def get_absolute_url(self):
        return reverse("choice", args = [self.slug])
    
class Attempt(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    grade = models.IntegerField()
    Answers = models.JSONField(null=True)
    slug = models.SlugField(default ="",blank=True,
                            null=False, unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.student.name + " " + self.exam.name
    def get_absolute_url(self):
        return reverse("attempt", args = [self.slug])