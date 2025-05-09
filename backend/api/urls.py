from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    PacienteListCreateView,
    PacienteDetailView,
    SesionListCreateView,
    SesionDetailView,
    CitaListCreateView, 
    CitaDetailView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Autenticación
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Pacientes
    path('pacientes/', PacienteListCreateView.as_view(), name='paciente-list-create'),
    path('pacientes/<int:pk>/', PacienteDetailView.as_view(), name='paciente-detail'),

    # Sesiones por paciente
    path('pacientes/<int:paciente_id>/sesiones/', SesionListCreateView.as_view(), name='sesion-list-create'),
    path('sesiones/<int:pk>/', SesionDetailView.as_view(), name='sesion-detail'),

    # 🗓️ Nuevas rutas para citas
    path('citas/', CitaListCreateView.as_view(), name='cita_list_create'),
    path('citas/<int:pk>/', CitaDetailView.as_view(), name='cita_detail'),
]
