# backend/api/models/AuditLog.py

from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    """
    Журнал аудита действий пользователей.
    Записи только добавляются — никогда не изменяются и не удаляются через API.
    """

    class Action(models.TextChoices):
        LOGIN_SUCCESS = 'LOGIN_SUCCESS', 'Успешный вход'
        LOGIN_FAILED = 'LOGIN_FAILED', 'Неверный пароль'
        LOGIN_BLOCKED = 'LOGIN_BLOCKED', 'Вход заблокирован (rate limit)'
        LOGOUT = 'LOGOUT', 'Выход'
        TICKET_CREATED = 'TICKET_CREATED', 'Создан билет'
        TICKET_UPDATED = 'TICKET_UPDATED', 'Изменён билет'
        TICKET_DELETED = 'TICKET_DELETED', 'Удалён билет'
        ATTEMPT_STARTED = 'ATTEMPT_STARTED', 'Начата попытка'
        ATTEMPT_SUBMITTED = 'ATTEMPT_SUBMITTED', 'Сдана попытка'
        USER_ROLE_CHANGED = 'USER_ROLE_CHANGED', 'Изменена роль пользователя'
        OTP_VERIFIED = 'OTP_VERIFIED', 'Пройдена двухфакторная аутентификация'
        OTP_FAILED = 'OTP_FAILED', 'Неверный OTP-код'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=32, choices=Action.choices)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=256, blank=True)
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.timestamp} | {self.action} | {self.user}"