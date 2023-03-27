from django.contrib import admin
from .models import *


class CourseAdmin(admin.ModelAdmin):    
    #prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'description', 'examiner')
    list_filter = ('name',)

class ExamAdmin(admin.ModelAdmin):
    #prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'description', 'course', 'exam_start_date', 'exam_end_date', 'duration', 'max_grade')
    list_filter = ('name',)

class EnrollmentRequestAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'request_date')
    list_filter = ('student', 'course')
    readonly_fields = ('request_date',)

class AttemptAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'grade')
    list_filter = ('student', 'exam')

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'exam')
    list_filter = ('question_text', 'exam')

admin.site.register(Course, CourseAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Attempt, AttemptAdmin)
admin.site.register(Answer)
admin.site.register(EnrollmentDetail)
admin.site.register(EnrollmentRequest, EnrollmentRequestAdmin)

