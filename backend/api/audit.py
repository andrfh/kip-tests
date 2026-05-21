# backend/api/audit.py
# Утилиты для записи в журнал аудита.
# Используется во views — вызывается явно, нет "магии".

from api.models.AuditLog import AuditLog


def get_client_ip(request) -> str | None:
    """Получить реальный IP клиента, учитывая прокси (Nginx)."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def get_user_agent(request) -> str:
    return request.META.get('HTTP_USER_AGENT', '')[:256]


def log_action(request, action: str, user=None, details: dict = None):
    """
    Записать действие в журнал аудита.

    Args:
        request: Django request object
        action: одно из AuditLog.Action
        user: пользователь (если None — берётся из request)
        details: дополнительные данные (словарь)
    """
    if user is None:
        user = request.user if request.user.is_authenticated else None

    AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        details=details or {},
    )