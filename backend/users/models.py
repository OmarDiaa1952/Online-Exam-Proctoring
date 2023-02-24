from django.db import models
from django.apps import apps
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT'
        EXAMINER = 'EXAMINER'
    
    # should use is_active field for email confirmation
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

# a more professional wat to create a profile for a student
# @receiver(post_save, sender=Student)
# def create_student_profile(sender, instance, created, **kwargs):
#     if created:
#         StudentProfile.objects.create(user=instance)

class StudentProfile(models.Model):
    user = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='student_profile')
    #slug = models.SlugField(unique=True) #In case we want to use the slug in the URL
    enrolled_courses = models.ManyToManyField('main_app.Course', related_name='students', blank=True)
    # personal photo field must be added
    # account status field must be added
    # def __str__(self):
    #     return self.name
    # def save(self, *args, **kwargs):    #This is to create the slug automatically when the model is saved
    #     self.slug = slugify(self.name)
    #     super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("student", args = [self.slug])