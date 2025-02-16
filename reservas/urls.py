from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, ReservacionViewSet

router = DefaultRouter() # 1
router.register(r'salas', SalaViewSet)
router.register(r'reservaciones', ReservacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
