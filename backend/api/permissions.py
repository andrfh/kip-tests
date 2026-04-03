from rest_framework.permissions import SAFE_METHODS, BasePermission

from api.models import StudentProfile, User


class TicketPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return request.user.role == User.Role.TEACHER
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return request.user.role == User.Role.TEACHER
        elif request.method == 'GET':
            if request.user.role == User.Role.STUDENT:
                return obj.study_group == StudentProfile.objects.get(student=request.user).study_group
            elif request.user.role == User.Role.TEACHER:
                return obj.author == request.user

        return False

class TicketAttemptPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return request.user.role == User.Role.STUDENT
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            if request.user.role == User.Role.STUDENT:
                return obj.ticket.study_group == StudentProfile.objects.get(student=request.user).study_group
        elif request.method == 'GET':
            if request.user.role == User.Role.TEACHER:
                return obj.ticket.author == request.user
            elif request.user.role == User.Role.STUDENT:
                return obj.student == request.user
