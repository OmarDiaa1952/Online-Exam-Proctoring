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

class EnrollmentRequestAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'request_date')
    list_filter = ('student', 'course')
    readonly_fields = ('request_date',)

admin.site.register(Course, CourseAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Question)
admin.site.register(Attempt)
admin.site.register(Answer)
admin.site.register(EnrollmentDetail)
admin.site.register(EnrollmentRequest, EnrollmentRequestAdmin)

