from django.db import models
from django.urls import reverse
from django.utils.text import slugify

from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT'
        EXAMINER = 'EXAMINER'
    
    # should use is_active field for email confirmation
    role = models.CharField(max_length=10, choices=Role.choices)

class ExaminerManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role=User.Role.EXAMINER)

class Examiner(User):
    class Meta:
        proxy = True
    
    base_role = User.Role.EXAMINER
    objects = ExaminerManager()

    @property
    def profile(self):
        return ExaminerProfile.objects.get(user=self)
    
    def save(self, *args, **kwargs):
        self.role = self.base_role
        super().save(*args, **kwargs)
        ExaminerProfile.objects.get_or_create(user=self)

# a more professional wat to create a profile for an examiner
# @receiver(post_save, sender=Examiner)
# def create_examiner_profile(sender, instance, created, **kwargs):
#     if created:
#         ExaminerProfile.objects.create(user=instance)

class ExaminerProfile(models.Model):
    # pending requests field must be added
    user = models.OneToOneField(Examiner, on_delete=models.CASCADE, related_name='examiner_profile')
    #slug = models.SlugField(unique=True) # in case we want to use the slug in the URL
    # def __str__(self):
    #     return self.name
    # def save(self, *args, **kwargs):    # this is to create the slug automatically when the model is saved
    #     self.slug = slugify(self.name)
    #     super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("examiner", args = [self.slug])

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    examiner = models.ForeignKey(Examiner, on_delete=models.SET_NULL , null=True, related_name='courses')
    slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse("course", args = [self.slug])

class StudentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role=User.Role.STUDENT)

class Student(User):
    class Meta:
        proxy = True
    
    objects = StudentManager()
    base_role = User.Role.STUDENT

    @property
    def profile(self):
        return StudentProfile.objects.get(user=self)
    
    def save(self, *args, **kwargs):
        self.role = self.base_role
        super().save(*args, **kwargs)
        StudentProfile.objects.get_or_create(user=self)

# a more professional wat to create a profile for a student
# @receiver(post_save, sender=Student)
# def create_student_profile(sender, instance, created, **kwargs):
#     if created:
#         StudentProfile.objects.create(user=instance)

class StudentProfile(models.Model):
    user = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='student_profile')
    #slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    enrolled_courses = models.ManyToManyField(Course, related_name='students')
    # personal photo field must be added
    # account status field must be added
    # def __str__(self):
    #     return self.name
    # def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
    #     self.slug = slugify(self.name)
    #     super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("student", args = [self.slug])

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
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    submission_time = models.DateTimeField(auto_now=False, auto_now_add=False)
    grade = models.IntegerField()
    Answers = models.TextField()
    # slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    def __str__(self):
        return self.student.name + " " + self.exam.name