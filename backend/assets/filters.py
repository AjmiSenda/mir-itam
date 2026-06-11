import django_filters
from .models import Asset, MaintenanceTicket, AuditLog


class AssetFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    serial_number = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Asset.Status.choices)
    category = django_filters.NumberFilter(field_name='category__id')
    location = django_filters.NumberFilter(field_name='location__id')
    assigned_to = django_filters.NumberFilter(field_name='assigned_to__id')
    warranty_expiry_before = django_filters.DateFilter(
        field_name='warranty_expiry', lookup_expr='lte'
    )
    warranty_expiry_after = django_filters.DateFilter(
        field_name='warranty_expiry', lookup_expr='gte'
    )

    class Meta:
        model = Asset
        fields = [
            'name', 'serial_number', 'status',
            'category', 'location', 'assigned_to',
            'warranty_expiry_before', 'warranty_expiry_after'
        ]


class MaintenanceTicketFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=MaintenanceTicket.Status.choices)
    priority = django_filters.ChoiceFilter(choices=MaintenanceTicket.Priority.choices)
    asset = django_filters.NumberFilter(field_name='asset__id')
    assigned_technician = django_filters.NumberFilter(field_name='assigned_technician__id')
    created_by = django_filters.NumberFilter(field_name='created_by__id')

    class Meta:
        model = MaintenanceTicket
        fields = ['title', 'status', 'priority', 'asset', 'assigned_technician', 'created_by']


class AuditLogFilter(django_filters.FilterSet):
    action = django_filters.CharFilter(lookup_expr='icontains')
    user = django_filters.NumberFilter(field_name='user__id')
    asset = django_filters.NumberFilter(field_name='asset__id')
    timestamp_after = django_filters.DateTimeFilter(
        field_name='timestamp', lookup_expr='gte'
    )
    timestamp_before = django_filters.DateTimeFilter(
        field_name='timestamp', lookup_expr='lte'
    )

    class Meta:
        model = AuditLog
        fields = ['action', 'user', 'asset', 'timestamp_after', 'timestamp_before']
