from rest_framework import serializers
from .models import Category, Location, Asset, MaintenanceTicket, AuditLog
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'terminal', 'floor', 'room', 'created_at']
        read_only_fields = ['id', 'created_at']


class AssetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    assigned_to_name = serializers.CharField(
        source='assigned_to.get_full_name', read_only=True
    )

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'serial_number', 'status', 'notes',
            'purchase_date', 'warranty_expiry', 'purchase_price', 'qr_code',
            'category', 'category_name',
            'location', 'location_name',
            'assigned_to', 'assigned_to_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'qr_code', 'created_at', 'updated_at']


class AssetDetailSerializer(AssetSerializer):
    category = CategorySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)


class MaintenanceTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    technician_name = serializers.CharField(
        source='assigned_technician.get_full_name', read_only=True
    )
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', read_only=True
    )

    class Meta:
        model = MaintenanceTicket
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'asset', 'asset_name',
            'assigned_technician', 'technician_name',
            'created_by', 'created_by_name',
            'created_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    asset_name = serializers.CharField(source='asset.name', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_name', 'action',
            'asset', 'asset_name', 'detail',
            'ip_address', 'timestamp'
        ]
        read_only_fields = [
            'id', 'user', 'user_name', 'action',
            'asset', 'asset_name', 'detail',
            'ip_address', 'timestamp'
        ]
