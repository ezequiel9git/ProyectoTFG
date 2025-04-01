# ProyectoTFG
# **Diario-Agenda de sesiones y seguimiento de pacientes para terapeutas**
Este proyecto consistirá en una aplicación donde que los terapeutas registren sesiones, hagan sus evaluaciones, guarden notas sobre el progreso de sus pacientes y programen futuras citas. Todo estaría bien estructurado y organizado para priorizar la comodidad del usuario. Cada paciente contaría con su categoría individual de registros, haciéndolo todo más organizado, y todo esto se almacenaría en una base de datos. La aplicación contaría por supuesto con login de acceso, así solo accedería el profesional y se respetaría la privacidad de cada paciente.
 
<br>

## 📌 Funcionalidades del Proyecto
- Registro e inicio de sesión para los terapeutas.
- Creación y gestión de pacientes.
- Registro de sesiones de terapia con notas.
- Listado de pacientes y sus sesiones.
- Autenticación con JWT.

<br>

## Proyecto
- [Planning de proyecto](https://github.com/users/ezequiel9git/projects/2)

<br>

## 🛠 Tecnologías
### 📟 Frontend
- React
- React Router
- Axios



### ➿ Backend
- Django
- Django REST Framework
- Simple JWT



### 📋 Base de Datos
- PostgreSQL



### 🔹 ORM
- Django ORM: Es un sistema que me permitirá interactuar con bases de datos utilizando Python en lugar de SQL. Esta herramienta me evita escribir SQL manualmente, es más seguro (previene inyecciones SQL), soporta PostgreSQL (la base de datos que voy a usar) y además es fácil de usar y mantener.


### 🔹 Autenticación
- JSON Web Tokens (JWT): Me encanta este mecanismo y me parece muy competente porque no usa sesiones en el servidor (lo que mejora la escalabilidad), es muy seguro (la firma del token impide modificaciones maliciosas), es rápido (no es necesario consultar la base de datos en cada solicitud) y es compatible con APIs.
