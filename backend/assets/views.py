from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q
from .models import Category, Location, Asset, MaintenanceTicket, AuditLog
from .serializers import (
    CategorySerializer, LocationSerializer,
    AssetSerializer, AssetDetailSerializer,
    MaintenanceTicketSerializer, AuditLogSerializer
)
from .filters import AssetFilter, MaintenanceTicketFilter, AuditLogFilter
from users.permissions import IsAdmin, IsManager, IsTechnician, IsAnyRole
from .signals import log_action


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAnyRole()]
        return [IsManager()]


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by('name')
    serializer_class = LocationSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'building', 'floor', 'room']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAnyRole()]
        return [IsManager()]


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related(
        'category', 'location', 'assigned_to'
    ).all().order_by('-created_at')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AssetFilter
    search_fields = ['name', 'asset_tag', 'serial_number']
    ordering_fields = ['name', 'status', 'created_at', 'warranty_expiry']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AssetDetailSerializer
        return AssetSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAnyRole()]
        if self.action == 'destroy':
            return [IsAdmin()]
        return [IsManager()]

    def perform_create(self, serializer):
        instance = serializer.save()
        instance._current_user = self.request.user
        log_action(
            user=self.request.user,
            action='asset_created',
            asset=instance,
            detail={'asset_tag': instance.asset_tag, 'status': instance.status},
            request=self.request
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        instance._current_user = self.request.user
        log_action(
            user=self.request.user,
            action='asset_updated',
            asset=instance,
            detail={'asset_tag': instance.asset_tag, 'status': instance.status},
            request=self.request
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action='asset_deleted',
            asset=None,
            detail={'asset_tag': instance.asset_tag, 'name': instance.name},
            request=self.request
        )
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[IsManager])
    def stats(self, request):
        total = Asset.objects.count()
        by_status = Asset.objects.values('status').annotate(count=Count('id'))
        by_category = Asset.objects.values(
            'category__name'
        ).annotate(count=Count('id'))
        expiring_soon = Asset.objects.filter(
            warranty_expiry__isnull=False
        ).order_by('warranty_expiry')[:5]

        return Response({
            'total_assets': total,
            'by_status': list(by_status),
            'by_category': list(by_category),
            'expiring_soon': AssetSerializer(expiring_soon, many=True).data
        })


class MaintenanceTicketViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTicket.objects.select_related(
        'asset', 'assigned_technician', 'created_by'
    ).all().order_by('-created_at')
    serializer_class = MaintenanceTicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MaintenanceTicketFilter
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'status', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsTechnician()]
        if self.action == 'destroy':
            return [IsAdmin()]
        return [IsTechnician()]

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        instance._current_user = self.request.user
        log_action(
            user=self.request.user,
            action='ticket_created',
            asset=instance.asset,
            detail={'ticket_id': instance.id, 'status': instance.status},
            request=self.request
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        instance._current_user = self.request.user
        log_action(
            user=self.request.user,
            action='ticket_updated',
            asset=instance.asset,
            detail={'ticket_id': instance.id, 'status': instance.status},
            request=self.request
        )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related(
        'user', 'asset'
    ).all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AuditLogFilter
    search_fields = ['action', 'user__username']
    ordering_fields = ['timestamp', 'action']
