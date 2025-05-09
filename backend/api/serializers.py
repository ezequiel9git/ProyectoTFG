from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Paciente, Sesion, Cita


# Serializer para el registro de usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user


# Serializer de sesiones
class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesion
        fields = [
            'id', 'paciente', 'fecha', 'duracion',
            'estado_emocional', 'evaluacion', 'seguimiento_habitos',
            'actividades', 'proxima_sesion', 'seguimiento'
        ]
        read_only_fields = ['id', 'paciente']  


#Serializer de citas
class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.ReadOnlyField(source='paciente.nombre')

    class Meta:
        model = Cita
        fields = ['id', 'paciente', 'paciente_nombre', 'fecha_inicio', 'fecha_fin', 'descripcion']
        read_only_fields = ['id', 'paciente_nombre']


# Serializer de pacientes (con sesiones anidadas opcionales)
class PacienteSerializer(serializers.ModelSerializer):
    sesiones = SesionSerializer(many=True, read_only=True)
    terapeuta = serializers.ReadOnlyField(source='terapeuta.username')

    class Meta:
        model = Paciente
        fields = [
            'id', 'nombre', 'edad', 'telefono', 'direccion',
            'asunto', 'medicacion', 'prioridad_seguimiento',
            'sesiones', 'terapeuta'
        ]
        read_only_fields = ['id', 'terapeuta']
