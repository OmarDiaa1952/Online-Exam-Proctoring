# from django.contrib import admin
# from .models import *

# # class StudentAdmin(admin.ModelAdmin):
# #     prepopulated_fields = {'slug': ('name',)}
# #     list_display = ('name', 'email', 'password', 'slug')
# #     list_filter = ('name',)

# # class ExaminerAdmin(admin.ModelAdmin):
# #     prepopulated_fields = {'slug': ('name',)}
# #     list_display = ('name', 'email', 'password', 'slug')
# #     list_filter = ('name',)

# class CourseAdmin(admin.ModelAdmin):    
#     prepopulated_fields = {'slug': ('name',)}
#     list_display = ('name', 'description', 'examiner', 'slug')
#     list_filter = ('name',)

# class ExamAdmin(admin.ModelAdmin):
#     prepopulated_fields = {'slug': ('name',)}
#     list_display = ('name', 'description', 'course', 'exam_start_date', 'exam_end_date', 'duration', 'max_grade', 'slug')
#     list_filter = ('name',)


# #admin.site.register(User)
# #admin.site.register(StudentProfile, StudentAdmin)
# #admin.site.register(ExaminerProfile, ExaminerAdmin)
# #admin.site.register(ExaminerProfile)
# #admin.site.register(StudentProfile)
# admin.site.register(Course, CourseAdmin)
# admin.site.register(Exam, ExamAdmin)
# admin.site.register(Question)
# admin.site.register(Choice)
# admin.site.register(Attempt)
