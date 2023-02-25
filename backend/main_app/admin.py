from django.contrib import admin
from .models import *


class CourseAdmin(admin.ModelAdmin):    
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'description', 'examiner', 'slug')
    list_filter = ('name',)

class ExamAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'description', 'course', 'exam_start_date', 'exam_end_date', 'duration', 'max_grade', 'slug')
    list_filter = ('name',)



admin.site.register(Course, CourseAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Attempt)
admin.site.register(EnrollmentDetail)
