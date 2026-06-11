from django.contrib import admin
from .models import Category, Location, Asset, MaintenanceTicket, AuditLog


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'terminal', 'floor', 'room', 'created_at']
    search_fields = ['name', 'terminal', 'room']
    ordering = ['terminal', 'name']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'serial_number', 'status',
        'category', 'location', 'assigned_to', 'warranty_expiry'
    ]
    list_filter = ['status', 'category', 'location']
    search_fields = ['name', 'serial_number']
    ordering = ['-created_at']
    readonly_fields = ['qr_code', 'created_at', 'updated_at']


@admin.register(MaintenanceTicket)
class MaintenanceTicketAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'asset', 'priority', 'status',
        'assigned_technician', 'created_by', 'created_at'
    ]
    list_filter = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'asset', 'ip_address', 'timestamp']
    list_filter = ['action']
    search_fields = ['action', 'user__username']
    ordering = ['-timestamp']
    readonly_fields = ['user', 'action', 'asset', 'detail', 'ip_address', 'timestamp']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
