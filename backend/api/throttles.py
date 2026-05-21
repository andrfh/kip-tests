# backend/api/throttles.py

from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """
    Жёсткий лимит для login endpoint:
    5 попыток в минуту с одного IP.
    Это защищает от автоматического перебора паролей.
    """
    scope = 'login'
    # rate задаётся в settings.py через DEFAULT_THROTTLE_RATES


class UserBurstRateThrottle(UserRateThrottle):
    """Лимит для аутентифицированных пользователей: burst (короткий период)."""
    scope = 'user_burst'


class UserSustainedRateThrottle(UserRateThrottle):
    """Лимит для аутентифицированных пользователей: sustained (длинный период)."""
    scope = 'user_sustained'