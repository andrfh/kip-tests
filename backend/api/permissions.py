# backend/api/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS
from api.models import StudentProfile, User


# ── Базовые permission-классы по ролям ──────────────────────────────────────

class IsAdmin(BasePermission):
    """Только администраторы."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.ADMIN
        )


class IsTeacher(BasePermission):
    """Только преподаватели."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.TEACHER
        )


class IsStudent(BasePermission):
    """Только студенты."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.STUDENT
        )


class IsAdminOrTeacher(BasePermission):
    """Администраторы или преподаватели."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in (User.Role.ADMIN, User.Role.TEACHER)
        )


# ── Permissions для конкретных ресурсов ─────────────────────────────────────

class TicketPermission(BasePermission):
    """
    Правила доступа к билетам:
    - GET список: Teacher (свои), Student (своей группы), Admin (все)
    - GET деталь: Teacher (свой), Student (своей группы)
    - POST (создать): только Teacher
    - PUT/PATCH (изменить): только Teacher-автор или Admin
    - DELETE: только Admin
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = request.user.role

        if request.method == 'DELETE':
            return role == User.Role.ADMIN

        if request.method == 'POST':
            return role in (User.Role.TEACHER, User.Role.ADMIN)

        if request.method in ('PUT', 'PATCH'):
            return role in (User.Role.TEACHER, User.Role.ADMIN)

        # GET — разрешено всем аутентифицированным (фильтрация — в get_queryset)
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        role = request.user.role

        if request.method == 'DELETE':
            return role == User.Role.ADMIN

        if request.method in ('PUT', 'PATCH'):
            # Teacher может редактировать только свой билет
            if role == User.Role.TEACHER:
                return obj.author == request.user
            return role == User.Role.ADMIN

        if request.method == 'GET':
            if role == User.Role.ADMIN:
                return True
            if role == User.Role.TEACHER:
                return obj.author == request.user
            if role == User.Role.STUDENT:
                try:
                    profile = StudentProfile.objects.select_related('study_group').get(
                        student=request.user
                    )
                    return obj.study_group == profile.study_group
                except StudentProfile.DoesNotExist:
                    return False

        return False


class TicketAttemptPermissions(BasePermission):
    """
    Правила доступа к попыткам:
    - POST (начать): только Student
    - GET список: Teacher (попытки по своим билетам), Student (свои попытки), Admin (все)
    - GET деталь: Teacher (если билет его), Student (если его попытка)
    - PUT/PATCH/DELETE: никому через API (только Admin через Django Admin)
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = request.user.role

        # Изменение и удаление попыток через API запрещено всем
        if request.method in ('PUT', 'PATCH', 'DELETE'):
            return False

        if request.method == 'POST':
            # POST на /attempts/ — начать попытку (только студент)
            # POST на /attempts/{id}/submit/ — тоже студент
            return role == User.Role.STUDENT

        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        role = request.user.role

        if request.method == 'GET':
            if role == User.Role.ADMIN:
                return True
            if role == User.Role.TEACHER:
                return obj.ticket.author == request.user
            if role == User.Role.STUDENT:
                return obj.student == request.user

        if request.method == 'POST':
            # submit action
            if role == User.Role.STUDENT:
                return obj.student == request.user

        return False


class IsAdminOrReadOnly(BasePermission):
    """Чтение — всем аутентифицированным, запись — только Admin."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role == User.Role.ADMIN