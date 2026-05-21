# backend/api/middleware.py
# Middleware добавляет security headers к каждому ответу.
# Эти headers защищают браузер пользователя.

class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Content Security Policy
        # Разрешаем ресурсы только с нашего домена.
        # 'unsafe-inline' для стилей нужен из-за React в dev-режиме.
        # В production можно убрать и использовать nonce.
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )

        # Запрет отображения в iframe (защита от clickjacking)
        response['X-Frame-Options'] = 'DENY'

        # Запрет на определение типа контента браузером
        response['X-Content-Type-Options'] = 'nosniff'

        # Не отправлять Referer на другие сайты
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        # Разрешённые браузерные функции
        response['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=()'
        )

        # HSTS — только HTTPS (включить когда будет SSL)
        # response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'

        return response