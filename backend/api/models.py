from django.db import models
from django.contrib.auth.models import User


class Paciente(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre
    edad = models.IntegerField()               # Edad
    telefono = models.CharField(max_length=15) # Teléfono de contacto
    direccion = models.TextField()             # Dirección de domicilio
    asunto = models.CharField(max_length=200, blank=True, null=True)  # Causa o problema a tratar
    medicacion = models.TextField(blank=True, null=True)              # Tratamiento médico

    PRIORIDAD_CHOICES = [
        ('Alta', 'Alta'),
        ('Media', 'Media'),
        ('Baja', 'Baja'),
    ]
    prioridad_seguimiento = models.CharField(
        max_length=10, choices=PRIORIDAD_CHOICES, default='Media'
    )

    terapeuta = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pacientes')

    def __str__(self):
        return self.nombre


class Sesion(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="sesiones")
    fecha = models.DateTimeField(auto_now_add=True)
    evaluación = models.TextField()
    actividades = models.TextField()
    proximasesion = models.TextField()

    def __str__(self):
        return f"Sesión de {self.paciente.nombre} el {self.fecha.strftime('%d-%m-%Y')}"
