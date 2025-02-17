from __future__ import absolute_import, unicode_literals

from celery import shared_task

from django.utils import timezone
from .models import Reservacion

@shared_task
def liberar_reservas_vencidas():
    """
    Esta tarea elimina las reservas cuya hora de fin ha pasado.
    """
    hora_actual = timezone.now()
    reservas_vencidas = Reservacion.objects.filter(hora_fin__lt=hora_actual)
    reservas_vencidas.delete()
    print(f"Se han eliminado {reservas_vencidas.count()} reservas vencidas.")