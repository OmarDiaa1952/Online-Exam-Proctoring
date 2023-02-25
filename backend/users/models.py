from django.db import models
from django.apps import apps
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT'
        EXAMINER = 'EXAMINER'
    
    #is_active has to be changed to false till mail confirmation
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=10, choices=Role.choices)



##################### Examiner Models #####################



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

# a more professional way to create a profile for an examiner
# @receiver(post_save, sender=Examiner)
# def create_examiner_profile(sender, instance, created, **kwargs):
#     if created:
#         ExaminerProfile.objects.create(user=instance)

class ExaminerProfile(models.Model):
    # pending requests field must be added
    user = models.OneToOneField(Examiner, on_delete=models.CASCADE, related_name='examiner_profile')



##################### Student Models #####################



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

# a more professional way to create a profile for a student
# @receiver(post_save, sender=Student)
# def create_student_profile(sender, instance, created, **kwargs):
#     if created:
#         StudentProfile.objects.create(user=instance)

class StudentProfile(models.Model):
    user = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='student_profile')
    enrolled_courses = models.ManyToManyField('main_app.Course', related_name='students',through='main_app.EnrollmentDetail', blank=True)
    # personal photo field must be added
    # account status field must be added #for adding photos