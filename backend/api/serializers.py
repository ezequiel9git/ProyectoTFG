from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Paciente, Sesion


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'nombre', 'edad', 'diagnostico', 'usuario']
        read_only_fields = ['usuario']  # Para que se asigne automáticamente desde el usuario logueado


class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesion
        fields = ['id', 'paciente', 'fecha', 'notas', 'terapeuta']
        read_only_fields = ['terapeuta']  # Para que se asigne automáticamente desde el usuario logueado
