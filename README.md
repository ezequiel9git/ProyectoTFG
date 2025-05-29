# 📖 Diario-Agenda de Sesiones y Seguimiento de Pacientes para Terapeutas
Esta aplicación web permite a terapeutas gestionar de forma integral la información de sus pacientes, registrar sesiones de terapia, realizar evaluaciones, llevar notas de progreso y programar citas en una agenda visual. El sistema está diseñado para priorizar la comodidad, la organización y la privacidad del profesional, ofreciendo una experiencia moderna y segura.

<br><br>

## 📝 Características principales
- 🔐 **Autenticación segura:** Registro e inicio de sesión de terapeutas mediante JWT.
- 👨‍👨‍👦‍👦**Gestión de pacientes:** Alta, edición, eliminación y visualización de pacientes, con campos para datos personales, motivo de consulta, medicación y prioridad de seguimiento.
- 📚 **Registro de sesiones:** Creación y edición de sesiones asociadas a cada paciente, con campos para fecha, duración, estado emocional, evaluación, seguimiento de hábitos, actividades asignadas y notas para próximas sesiones.
- 📅 **Agenda de citas:** Calendario interactivo para programar, editar y eliminar citas, asociando cada cita a un paciente.
- 📊 **Estadísticas y reportes:** Panel de reportes con gráficos y tablas que muestran estadísticas globales y por paciente, incluyendo distribución de prioridades, duración de sesiones y pacientes con mayor seguimiento.
- 🌠 **Interfaz intuitiva:** Navegación protegida para usuarios autenticados, diseño responsive y uso de iconografía visual.
- 🔩 **Backend robusto:** API RESTful desarrollada en Django y Django REST Framework, con PostgreSQL como base de datos.
- 💻 **Frontend moderno:** Aplicación React con Bootstrap, React Router, FullCalendar y Recharts para visualización de datos.

<br><br>

## 📂 Estructura del proyecto

```
ProyectoTFG/
│
├── backend/
│   ├── manage.py
│   ├── backend/           # Configuración principal de Django
│   └── api/               # App principal: modelos, vistas, serializers, urls
│
├── frontend/
│   ├── public/
│   └── src/               # Componentes, páginas, contextos y utilidades de React
│
└── README.md
```

<br><br>

## ⏫ Tecnologías utilizadas
- 📺 **Frontend:** React, Bootstrap, React Router, Axios, FullCalendar, Recharts, React Icons
- 🔀 **Backend:** Django, Django REST Framework, Simple JWT, CORS Headers
- 📋 **Base de datos:** PostgreSQL
- 📑 **ORM:** Django ORM

<br><br>

## ⏬ Instalación y ejecución

### 🔽 Backend

1. Instala las dependencias en un entorno virtual:
   ```sh
   cd backend
   python -m venv env
   source env/bin/activate  # En Windows: .\env\Scripts\activate
   pip install -r requirements.txt
   ```
2. Configura la base de datos PostgreSQL en settings.py.
3. Aplica migraciones y crea un superusuario:
   ```sh
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```
   El backend estará disponible en [http://localhost:8000](http://localhost:8000).

### 🔽 Frontend

1. Instala las dependencias:
   ```sh
   cd frontend
   npm install
   ```
2. Inicia la aplicación:
   ```sh
   npm start
   ```
   El frontend estará disponible en [http://localhost:3000](http://localhost:3000).

<br><br>

## 🖱️ Uso
1. Regístrate como terapeuta y accede con tus credenciales.
2. Gestiona pacientes y sus sesiones desde el panel principal.
3. Programa y administra tus citas en la agenda.
4. Consulta estadísticas y reportes visuales para mejorar tu gestión.

<br><br>

## ©️ Licencia
Desarrollado como Trabajo de Fin de Grado por Ezequiel.
