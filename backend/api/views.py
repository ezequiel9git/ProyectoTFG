from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Paciente, Sesion
from .serializers import UserSerializer, PacienteSerializer, SesionSerializer


# Token JWT personalizado con nombre de usuario
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Registro de usuarios
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer


# Lista y creación de pacientes
class PacienteListCreateView(generics.ListCreateAPIView):
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Paciente.objects.filter(terapeuta=self.request.user)

    def perform_create(self, serializer):
        serializer.save(terapeuta=self.request.user)


# Detalle, actualización y eliminación de pacientes
class PacienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Paciente.objects.filter(terapeuta=self.request.user)


# Lista y creación de sesiones para un paciente específico
class SesionListCreateView(generics.ListCreateAPIView):
    serializer_class = SesionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        paciente_id = self.kwargs['paciente_id']
        return Sesion.objects.filter(paciente__id=paciente_id, paciente__terapeuta=self.request.user)

    def perform_create(self, serializer):
        paciente_id = self.kwargs['paciente_id']
        paciente = Paciente.objects.get(id=paciente_id, terapeuta=self.request.user)
        serializer.save(paciente=paciente)


# Detalle, actualización y eliminación de una sesión
class SesionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SesionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Sesion.objects.filter(paciente__terapeuta=self.request.user)
