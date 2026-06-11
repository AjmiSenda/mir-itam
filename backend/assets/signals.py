from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Asset, MaintenanceTicket, AuditLog


def get_client_ip(request):
    if request is None:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def log_action(user, action, asset=None, detail=None, request=None):
    AuditLog.objects.create(
        user=user,
        action=action,
        asset=asset,
        detail=detail or {},
        ip_address=get_client_ip(request)
    )


@receiver(post_save, sender=Asset)
def asset_saved(sender, instance, created, **kwargs):
    action = 'asset_created' if created else 'asset_updated'
    request = kwargs.get('request')
    user = getattr(instance, '_current_user', None)
    if user and user.is_authenticated:
        log_action(
            user=user,
            action=action,
            asset=instance,
            detail={'asset_tag': instance.asset_tag, 'status': instance.status},
            request=request
        )


@receiver(post_delete, sender=Asset)
def asset_deleted(sender, instance, **kwargs):
    user = getattr(instance, '_current_user', None)
    if user and user.is_authenticated:
        log_action(
            user=user,
            action='asset_deleted',
            asset=None,
            detail={'asset_tag': instance.asset_tag, 'name': instance.name}
        )


@receiver(post_save, sender=MaintenanceTicket)
def ticket_saved(sender, instance, created, **kwargs):
    action = 'ticket_created' if created else 'ticket_updated'
    user = getattr(instance, '_current_user', None)
    if user and user.is_authenticated:
        log_action(
            user=user,
            action=action,
            asset=instance.asset,
            detail={'ticket_id': instance.id, 'status': instance.status}
        )
