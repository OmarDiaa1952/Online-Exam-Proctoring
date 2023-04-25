from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is a student
        if request.user.role != 'STUDENT':
            return False
        
        return True

class IsExaminer(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is an examiner
        if request.user.role != 'EXAMINER':
            return False
        
        return True