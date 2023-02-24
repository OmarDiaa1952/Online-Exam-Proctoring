from django.contrib import admin
from .models import *
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_filter = ('role',)
    readonly_fields = ('date_joined', 'last_login', 'user_permissions', 'groups', 'is_staff', 'is_superuser')


admin.site.register(Student)
admin.site.register(Examiner)
admin.site.register(User, UserAdmin)
admin.site.register(StudentProfile)
admin.site.register(ExaminerProfile)