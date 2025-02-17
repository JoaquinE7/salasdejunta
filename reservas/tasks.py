import threading
import time
from datetime import datetime
from django.utils.timezone import now
from reservas.models import Reservacion

# 1
def liberar_salas():
    while True:
        tiempo_actual = now()
        Reservacion.objects.filter(hora_fin__lt=tiempo_actual).delete() # 2
        print(f"[{datetime.now()}] Reservaciones vencidas eliminadas.")
        time.sleep(60) 

# 3
def iniciar_hilo_liberacion():
    hilo = threading.Thread(target=liberar_salas, daemon=True)
    hilo.start()




"""from __future__ import absolute_import, unicode_literals

from celery import shared_task

from django.utils import timezone
from .models import Reservacion

@shared_task
def liberar_reservas_vencidas():
    # Esta tarea elimina las reservas cuya hora de fin ha pasado.
    hora_actual = timezone.now()
    reservas_vencidas = Reservacion.objects.filter(hora_fin__lt=hora_actual)
    reservas_vencidas.delete()
    print(f"Se han eliminado {reservas_vencidas.count()} reservas vencidas.")
"""
