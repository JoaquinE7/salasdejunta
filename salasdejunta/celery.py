from __future__ import absolute_import, unicode_literals

import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salasdejunta.settings')

app = Celery('salasdejunta')

app.config_from_object('django.conf:settings', namespace='CELERY')

# app.conf.beat_schedule = {
#     'liberar_reservas_vencidas': {
#         'tasks': 'reservas.tasks.liberar_reservas_vencidas',
#         'schedule': 60
#     }
# }

app.autodiscover_tasks()

# @app.task(bind=True)
# def debug_task(self):
#     print('Request: {0!r}'.format(self.request))