from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
#from django.utils import timezone
from .models import Sala, Reservacion
from .serializers import SalaSerializer, ReservacionSerializer
from datetime import datetime
import pytz


class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all() # 1
    serializer_class = SalaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']
            
            # 9
            if Sala.objects.filter(nombre=nombre).exists():
                return Response({"error": "Ya existe una sala con este nombre"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all() # 1
    serializer_class = ReservacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # 6
        hora_actual = datetime.now()
        aux = str(hora_actual)
        aux = aux.split('.')[0]
        aux += "-06:00"
        hora_actual = datetime.strptime(aux, "%Y-%m-%d %H:%M:%S%z")

        if serializer.is_valid():
            # 7
            sala = serializer.validated_data['sala']
            hora_inicio = serializer.validated_data['hora_inicio']
            hora_inicio.astimezone()
            hora_fin = serializer.validated_data['hora_fin']
            hora_fin.astimezone()

            hora_inicio = hora_inicio.astimezone()
            hora_fin = hora_fin.astimezone()

            # 8
            if hora_inicio < hora_actual or hora_fin < hora_actual:
                return Response({"error": "No se puede reservar en un tiempo pasado"}, status=status.HTTP_400_BAD_REQUEST)

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

            serializer.validated_data['hora_inicio'] = hora_inicio
            serializer.validated_data['hora_fin'] = hora_fin
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 5
def home(request):
    return render(request, 'index.html')