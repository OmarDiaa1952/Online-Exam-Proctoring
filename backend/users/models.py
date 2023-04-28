from django.db import models
from django.apps import apps
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.http import JsonResponse

class User(AbstractUser):
    #email = models.EmailField(unique=True)
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
        try: 
            self.validate_unique()
        except ValidationError as e:
            return JsonResponse(e.message_dict)
        super().save(*args, **kwargs)
        ExaminerProfile.objects.get_or_create(user=self)

    def validate_unique(self, exclude=None):
        super().validate_unique(exclude=exclude)
        if Examiner.objects.filter(email=self.email).exists():
            raise ValidationError({'email': ['Another examiner with this email already exists.']})


# a more professional way to create a profile for an examiner
# @receiver(post_save, sender=Examiner)
# def create_examiner_profile(sender, instance, created, **kwargs):
#     if created:
#         ExaminerProfile.objects.create(user=instance)

class ExaminerProfile(models.Model):
    # pending requests field must be added
    user = models.OneToOneField(Examiner, on_delete=models.CASCADE, related_name='examiner_profile')

    def save(self, *args, **kwargs):
        # set id to user id before saving
        self.id = self.user.id
        super().save()



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
        try: 
            self.validate_unique()
        except ValidationError as e:
            return JsonResponse(e.message_dict)
        super().save(*args, **kwargs)
        StudentProfile.objects.get_or_create(user=self)

    def validate_unique(self, exclude=None):
        super().validate_unique(exclude=exclude)
        if Student.objects.filter(email=self.email).exists():
            raise ValidationError({'email': ['Another student with this email already exists.']})

    def __str__(self) -> str:
        return f'{self.username} - {self.pk}'

# a more professional way to create a profile for a student
# @receiver(post_save, sender=Student)
# def create_student_profile(sender, instance, created, **kwargs):
#     if created:
#         StudentProfile.objects.create(user=instance)

class StudentProfile(models.Model):
    # model containing all other fields related to the student

    # determining upload path for profile picture
    def upload_to(self, filename):
        # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        return 'user_{0}/profile_pic/{1}'.format(self.user.id, filename)
    
    user = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='student_profile')
    enrolled_courses = models.ManyToManyField('main_app.Course', related_name='students',through='main_app.EnrollmentDetail', blank=True)
    photo = models.ImageField(upload_to=upload_to, blank=True, null=True)
    has_photo = models.BooleanField(default=False)

    # overriding save method to set id to user id
    # so that we can use user id as primary key
    def save(self, *args, **kwargs):
        # set id to user id before saving
        self.id = self.user.id
        if self.photo:
            self.has_photo = True
        super().save()

# @receiver(post_save, sender=StudentProfile)
# def update_has_photo(sender, instance, **kwargs):
#     if instance.photo:
#         instance.has_photo = True
#     else:
#         instance.has_photo = False
#     instance.save()