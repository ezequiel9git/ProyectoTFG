from django.db import models
from django.contrib.auth.models import User


class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.IntegerField()
    telefono = models.CharField(max_length=20)
    direccion = models.TextField()
    asunto = models.CharField(max_length=255, blank=True, null=True)
    medicacion = models.TextField(blank=True, null=True)
    prioridad_seguimiento = models.CharField(max_length=20, choices=[
        ('Alta', 'Alta'),
        ('Media', 'Media'),
        ('Baja', 'Baja'),
    ], default='Media')

    terapeuta = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pacientes')  # <-- Añadido

    def __str__(self):
        return self.nombre


class Sesion(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='sesiones')
    fecha = models.DateField()
    notas = models.TextField()
    seguimiento = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Sesión de {self.paciente.nombre} el {self.fecha}"
