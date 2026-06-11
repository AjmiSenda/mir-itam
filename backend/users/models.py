from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        TECHNICIAN = "technician", "Technician"
        MANAGER = "manager", "Manager"
        VIEWER = "viewer", "Viewer"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VIEWER,
        db_index=True,
    )
    department = models.CharField(max_length=100, blank=True, default="")
    phone_number = models.CharField(max_length=30, blank=True, default="")
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

