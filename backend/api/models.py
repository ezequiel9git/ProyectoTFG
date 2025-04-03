from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.IntegerField()
    telefono = models.CharField(max_length=15)
    direccion = models.TextField() 
    asunto = models.TextField() # Descripción del problema enfrentado
    prioridad = models.TextField() # Prioridad de seguimiento
    terapeuta = models.ForeignKey(User, on_delete=models.CASCADE)  # Relación con el terapeuta


    # Método STR para identificar al usuario por su nombre (self.nombre)
    def __str__(self):
        return self.nombre



class Sesion(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="sesiones")
    fecha = models.DateTimeField(auto_now_add=True)
    evaluación = models.TextField() # Informe de evaluación de la sesión
    actividades = models.TextField() # Tareas programadas para el paciente
    proximasesion = models.TextField() # Anotaciones para la próxima sesión

    # Método STR para identificar sesión en base al paciente y fecha de sesión
    def __str__(self):
        return f"Sesión de {self.paciente.nombre} el {self.fecha.strftime('%d-%m-%Y')}"
