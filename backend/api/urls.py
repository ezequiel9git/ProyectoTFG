from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, SesionViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import register_user # Registro usuario

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'sesiones', SesionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'), # registro usurio
]
