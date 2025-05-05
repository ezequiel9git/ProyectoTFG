from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    PacienteListCreateView,
    SesionCreateView,
    CustomTokenObtainPairView,
)

urlpatterns = [
    # Autenticación
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Endpoints de pacientes y sesiones
    path('pacientes/', PacienteListCreateView.as_view(), name='pacientes'),
    path('sesiones/', SesionCreateView.as_view(), name='sesiones'),
]
