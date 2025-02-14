from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

# 1
class Sala(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    capacidad = models.IntegerField()
    
    def __str__(self):
        return self.nombre

# 2
class Reservacion(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE) # 3
    hora_inicio = models.DateTimeField()
    hora_fin = models.DateTimeField()

    # 4
    def clean(self):
        if (self.hora_fin - self.hora_inicio).total_seconds() / 3600 > 2:
            raise ValidationError("No se puede reservar una sala por mas de 2 horas.")

        # 5
        reservas_existentes = Reservacion.objects.filter(sala=self.sala).exclude(id=self.id)

        for reserva in reservas_existentes:
            if (self.hora_inicio < reserva.hora_fin) and (self.hora_fin > reserva.hora_inicio):
                raise ValidationError("La sala ya esta reservada en este horario.")

    def __str__(self):
        return f"{self.sala.nombre} - {self.hora_inicio.strftime('%d-%m-%Y %H:%M')} a {self.hora_fin.strftime('%H:%M')}"