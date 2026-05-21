from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp

class User(AbstractUser):
    surname = models.CharField(max_length=150)

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        STUDENT = 'STUDENT', 'Student'
        TEACHER = 'TEACHER', 'Teacher'

    role = models.CharField(max_length=32, choices=Role.choices)
    base_role = None

    # 2FA поля
    totp_secret = models.CharField(max_length=32, blank=True, default='')
    totp_enabled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role or self.role
        super().save(*args, **kwargs)

    def get_totp_uri(self) -> str:
        """Возвращает otpauth URI для QR-кода."""
        from django.conf import settings
        issuer = getattr(settings, 'OTP_TOTP_ISSUER', 'KIP-Tests')
        return pyotp.totp.TOTP(self.totp_secret).provisioning_uri(
            name=self.username,
            issuer_name=issuer,
        )

    def verify_totp(self, code: str) -> bool:
        """Проверить OTP-код. Окно 1 — допускает ±30 сек."""
        if not self.totp_secret:
            return False
        totp = pyotp.TOTP(self.totp_secret)
        return totp.verify(code, valid_window=1)