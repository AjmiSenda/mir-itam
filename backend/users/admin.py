from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'role', 'department', 'is_active'
    ]
    list_filter = ['role', 'is_active', 'department']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = UserAdmin.fieldsets + (
        ('Airport ITAM', {
            'fields': ('role', 'department', 'phone_number')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Airport ITAM', {
            'fields': ('role', 'department', 'phone_number')
        }),
    )
