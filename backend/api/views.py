from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Paciente, Sesion, Cita
from .serializers import UserSerializer, PacienteSerializer, SesionSerializer, CitaSerializer


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
        return Sesion.objects.filter(
            paciente__id=paciente_id,
            paciente__terapeuta=self.request.user
        )

    def perform_create(self, serializer):
        paciente_id = self.kwargs['paciente_id']
        paciente = get_object_or_404(Paciente, id=paciente_id, terapeuta=self.request.user)
        serializer.save(paciente=paciente)


# Detalle, actualización y eliminación de una sesión
class SesionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SesionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Sesion.objects.filter(paciente__terapeuta=self.request.user)


# Vista para listar y crear citas
class CitaListCreateView(generics.ListCreateAPIView):
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cita.objects.filter(paciente__terapeuta=self.request.user)

    def perform_create(self, serializer):
        paciente = get_object_or_404(Paciente, id=self.request.data.get('paciente'), terapeuta=self.request.user)
        serializer.save(paciente=paciente)

# Vista para recuperar, actualizar o eliminar una cita específica
class CitaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cita.objects.filter(paciente__terapeuta=self.request.user)