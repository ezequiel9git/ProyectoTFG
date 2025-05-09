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

    terapeuta = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pacientes')

    def __str__(self):
        return self.nombre


class Sesion(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='sesiones')
    fecha = models.DateField()
    duracion = models.IntegerField(default=30, help_text="Duración en minutos")
    estado_emocional = models.TextField(blank=True, null=True)
    evaluacion = models.TextField(blank=True, null=True)
    seguimiento_habitos = models.TextField(blank=True, null=True)
    actividades = models.TextField(blank=True, null=True)
    proxima_sesion = models.TextField(blank=True, null=True)
    seguimiento = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Sesión de {self.paciente.nombre} el {self.fecha}"


class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas')
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Cita con {self.paciente.nombre} el {self.fecha_inicio.strftime("%Y-%m-%d %H:%M")}'
