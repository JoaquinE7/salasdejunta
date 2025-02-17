from django.apps import AppConfig


class ReservasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reservas'

    # 1
    def ready(self):
        from reservas.tasks import iniciar_hilo_liberacion
        iniciar_hilo_liberacion()