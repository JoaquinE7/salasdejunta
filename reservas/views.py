from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Sala, Reservacion
from .serializers import SalaSerializer, ReservacionSerializer

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all() # 1
    serializer_class = SalaSerializer

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all() # 1
    serializer_class = ReservacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            sala = serializer.validated_data['sala']
            hora_inicio = serializer.validated_data['hora_inicio']
            hora_fin = serializer.validated_data['hora_fin']

            # 2
            reservas_existentes = Reservacion.objects.filter(sala=sala)
            for reserva in reservas_existentes:
                if (hora_inicio < reserva.hora_fin) and (hora_fin > reserva.hora_inicio):
                    return Response({"error": "La sala ya esta reservada en este horario."}, status=status.HTTP_400_BAD_REQUEST)

            # 3
            if (hora_fin - hora_inicio).total_seconds() / 3600 > 2:
                return Response({"error": "No puedes reservar una sala por mas de 2 horas."}, status=status.HTTP_400_BAD_REQUEST)
            
            # 4
            if (hora_fin < hora_inicio):
                return Response({"error": "Reservacion no valida"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
