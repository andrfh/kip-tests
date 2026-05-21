import re
from django.core.exceptions import ValidationError


class StrongPasswordValidator:
    def validate(self, password, user=None):
        errors = []

        if len(password) < 8:
            errors.append('Пароль должен содержать минимум 8 символов.')

        if not re.search(r'[A-Z]', password):
            errors.append('Пароль должен содержать минимум одну заглавную букву.')

        if not re.search(r'[a-z]', password):
            errors.append('Пароль должен содержать минимум одну строчную букву.')

        if not re.search(r'\d', password):
            errors.append('Пароль должен содержать минимум одну цифру.')

        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]', password):
            errors.append('Пароль должен содержать минимум один спецсимвол.')

        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return (
            'Пароль должен содержать минимум 8 символов, '
            'uppercase, lowercase, цифру и спецсимвол.'
        )