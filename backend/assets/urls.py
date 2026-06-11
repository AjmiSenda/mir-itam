from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, LocationViewSet,
    AssetViewSet, MaintenanceTicketViewSet, AuditLogViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'tickets', MaintenanceTicketViewSet, basename='ticket')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')

urlpatterns = [
    path('', include(router.urls)),
]
