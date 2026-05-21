# backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib import messages

from .models import Ticket, User, StudentProfile, StudyGroup, Subject
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'action', 'user', 'ip_address')
    list_filter = ('action',)
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('timestamp', 'user', 'action', 'ip_address', 'user_agent', 'details')
    ordering = ('-timestamp',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name = 'Профиль студента'
    verbose_name_plural = 'Профиль студента'


@admin.register(User)
class ApiUserAdmin(UserAdmin):
    model = User
    inlines = [StudentProfileInline]

    # readonly: только id, НЕ totp_enabled — его нужно уметь менять
    readonly_fields = ('id',) + UserAdmin.readonly_fields

    list_display = ('id', 'username', 'role', 'totp_enabled', 'is_active')
    list_filter = ('role', 'totp_enabled', 'is_active')
    search_fields = ('username', 'first_name', 'last_name')

    fieldsets = (
        (None, {'fields': ('id', 'role')}),
        ('Двухфакторная аутентификация', {
            'fields': ('totp_enabled',),
            'description': (
                'Для принудительного сброса 2FA: '
                'выберите пользователя → Actions → "Сбросить 2FA пользователю". '
                'Флаг totp_enabled можно поставить вручную ТОЛЬКО если пользователь '
                'уже настроил секрет через /2fa/setup/ + /2fa/confirm/.'
            ),
        }),
    ) + UserAdmin.fieldsets

    actions = ['reset_2fa']

    @admin.action(description='Сбросить 2FA выбранным пользователям')
    def reset_2fa(self, request, queryset):
        """
        Admin action для сброса 2FA.
        Используется когда пользователь потерял доступ к телефону.
        """
        updated = queryset.update(totp_enabled=False, totp_secret='')
        self.message_user(
            request,
            f'2FA сброшена для {updated} пользователей.',
            messages.SUCCESS
        )


admin.site.register(Ticket)
admin.site.register(StudyGroup)
admin.site.register(Subject)