# MesaNova — Sistema de Gestión de Reservas para Restaurantes

## 1. Descripción del proyecto

**MesaNova** es una aplicación web académica desarrollada con React y Vite que permite gestionar reservas de mesas en restaurantes mediante una interfaz intuitiva y adaptable a dispositivos móviles y computadoras.

El sistema está orientado a dos tipos de usuarios: clientes y administradores. Los clientes pueden consultar la disponibilidad, realizar reservas, modificarlas y cancelarlas. Los administradores pueden visualizar las reservas registradas, consultar indicadores y utilizar un calendario interactivo para organizar la ocupación del restaurante.

El proyecto se desarrolla como parte del curso **Desarrollo de Interfaces 2**.

## 2. Integrantes del equipo

- Sebastian Lopez Mendoza
- Piero Navarro
- Steven Nicolas Maylle Justo
- Raymond Augusto Díaz Herrera

**Curso:** Desarrollo de Interfaces 2

**Proyecto:** MesaNova — Sistema de Gestión de Reservas para Restaurantes

**Modalidad:** Trabajo grupal de cuatro integrantes 

## 3. Problemática

Muchos restaurantes todavía gestionan sus reservas mediante llamadas telefónicas o atención presencial. Esto puede ocasionar duplicaciones, confusión en los horarios, dificultades para controlar la disponibilidad de mesas y demoras en la atención.

MesaNova propone centralizar el proceso de reservas mediante una aplicación web que facilite la organización del restaurante y mejore la experiencia del cliente.

## 4. Objetivos

### Objetivo general

Desarrollar una aplicación web funcional para gestionar reservas de mesas en restaurantes, utilizando React y principios de diseño de interfaces y experiencia de usuario.

### Objetivos específicos

- Facilitar la creación, modificación y cancelación de reservas.
- Consultar la disponibilidad de mesas según fecha, horario y número de personas.
- Evitar conflictos de ocupación y reservas duplicadas.
- Proporcionar un calendario interactivo para la administración.
- Implementar componentes reutilizables mediante JSX.
- Utilizar hooks de React para gestionar el estado y los efectos de la aplicación.
- Ofrecer una interfaz adaptable a dispositivos móviles y de escritorio.

## 5. Tecnologías utilizadas

| Tecnología | Utilización |
|---|---|
| React | Desarrollo de la interfaz web |
| JavaScript | Lógica e interacciones |
| JSX | Construcción de componentes reutilizables |
| CSS3 | Estilos y diseño adaptable |
| Vite | Entorno de desarrollo y compilación |
| Figma | Wireframes y prototipos interactivos |
| IndexedDB | Persistencia local de las reservas |
| Git y GitHub | Control de versiones y publicación del código |

### Hooks de React

- **useState:** gestión de estados e interacciones.
- **useEffect:** sincronización de efectos y actualización de información.
- **Hooks personalizados:** reutilización de la lógica relacionada con las reservas.

## 6. Funcionalidades principales

### Módulo del cliente

- Página principal de MesaNova.
- Pantallas de inicio de sesión y registro de demostración.
- Selección de fecha, hora y cantidad de personas.
- Consulta de disponibilidad de mesas.
- Creación y confirmación de reservas.
- Generación de un código de reserva.
- Consulta de reservas registradas.
- Búsqueda y filtros.
- Modificación y cancelación de reservas.
- Validación de formularios y mensajes de error.

### Módulo administrativo

- Panel principal con indicadores de reservas.
- Visualización de reservas del día.
- Gestión de reservas confirmadas, pendientes y canceladas.
- Búsqueda y filtrado de reservas.
- Modificación y cancelación de reservas.
- Calendario interactivo.
- Visualización de detalles de las reservas.
- Interfaz adaptable a diferentes tamaños de pantalla.

## 7. Reglas de funcionamiento

El prototipo utiliza seis mesas:

| Mesa | Capacidad |
|---|---|
| M1 | 2 personas |
| M2 | 2 personas |
| M3 | 4 personas |
| M4 | 4 personas |
| M5 | 6 personas |
| M6 | 6 personas |

Las reservas tienen una duración de 90 minutos.

**Horarios configurados:** 12:00, 13:30, 15:00, 18:00, 19:30 y 21:00, utilizando la zona horaria `America/Lima`.

El sistema permite seleccionar fechas dentro de los siguientes 90 días, respetando las restricciones de horarios futuros.

La lógica de disponibilidad busca impedir que una misma mesa sea asignada a reservas confirmadas con horarios superpuestos.

## 8. Instalación y ejecución

### Requisitos previos

- Node.js compatible con el proyecto.
- npm.
- Visual Studio Code u otro editor.
- Navegador web actualizado.

### Pasos para ejecutar MesaNova

**1.** Descargar o clonar el repositorio.

**2.** Abrir la carpeta que contiene `package.json` en Visual Studio Code.

**3.** Abrir una terminal e instalar las dependencias:

```bash
npm ci
```

**4.** Iniciar el servidor de desarrollo:

```bash
npm run dev
```

**5.** Abrir la dirección que muestre Vite, normalmente:

`http://localhost:5173/`

### Comandos adicionales

```bash
npm test
npm run build
npm run preview
```

- `npm test`: ejecuta las pruebas automatizadas configuradas.
- `npm run build`: genera la versión de producción.
- `npm run preview`: permite visualizar la compilación.

**Nota:** no se debe abrir directamente `index.html` para ejecutar la aplicación React.

## 9. Estructura del proyecto

```text
MesaNova/
├── .github/
├── design/
│   ├── figma-plugin/
│   ├── wireframes/
│   ├── LEEME_FIGMA.md
│   └── prototipo_interactivo.html
├── docs/
│   ├── evidencias/
│   ├── PRUEBAS.md
│   └── Sustentacion_Tecnica_MesaNova.pdf
├── public/
│   └── Restaurante.jpg
├── src/
│   ├── components/
│   │   ├── AdminCalendar.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminReservations.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── Calendar.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ReservationForm.jsx
│   │   ├── ReservationList.jsx
│   │   └── TableSelector.jsx
│   ├── hooks/
│   ├── lib/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── tests/
├── .gitignore
├── package.json
└── README.md
```

La carpeta `docs` contiene la documentación de la entrega. El PDF de sustentación contiene el resumen técnico, evidencias y aspectos pendientes de entrega.

## 10. Pruebas de funcionamiento

Se han realizado comprobaciones manuales del flujo del cliente y de las funciones principales del administrador.

### Funcionalidades comprobadas

- Navegación entre las pantallas principales.
- Creación de reservas.
- Selección de mesas disponibles.
- Confirmación de reservas.
- Búsqueda de reservas registradas.
- Modificación y cancelación.
- Filtros del panel administrativo.
- Calendario interactivo.
- Actualización de indicadores.
- Persistencia después de recargar la página.
- Visualización en dispositivos móviles.

### Procedimiento de prueba

1. Abrir la aplicación.
2. Seleccionar la opción para reservar una mesa.
3. Elegir una fecha, hora y cantidad de personas.
4. Seleccionar una mesa disponible.
5. Completar los datos solicitados.
6. Confirmar la reserva.
7. Consultar la reserva desde «Mis reservas».
8. Acceder al panel administrativo.
9. Buscar y modificar la reserva.
10. Comprobar los cambios en el calendario y los indicadores.

Los resultados detallados y las evidencias se documentarán en `docs/PRUEBAS.md` y en el informe de sustentación.

## 11. Diseño y prototipo de Figma

MesaNova cuenta con pantallas diseñadas para el flujo del cliente y la administración.

### Flujo del cliente

- Inicio.
- Iniciar sesión.
- Crear cuenta.
- Reservación.
- Selección de mesa.
- Confirmación.

### Flujo administrativo

- Dashboard.
- Gestión de reservas.
- Calendario interactivo.

El prototipo incorpora conexiones entre pantallas. Se continúa revisando la interacción visual de selección de mesas y las demás microinteracciones.

**Enlace del prototipo Figma:** Pendiente de insertar el enlace compartido definitivo.

El archivo `design/prototipo_interactivo.html` es un recurso complementario de demostración y no sustituye al prototipo de Figma requerido para la entrega.

## 12. Pruebas de usabilidad y mejoras

El proyecto contempla la evaluación de la navegación, claridad de los formularios, selección de mesas y facilidad de uso desde dispositivos móviles.

Durante las comprobaciones propias se revisaron aspectos de distribución y adaptación del panel administrativo en pantallas pequeñas, así como el funcionamiento de los controles principales.

**Pendiente:** completar y documentar las pruebas de usabilidad con usuarios simulados, incluyendo las tareas, observaciones, problemas identificados y mejoras realizadas.

Los resultados se incorporarán al informe técnico sin atribuir pruebas a participantes que todavía no las hayan realizado.

## 13. Alcance y limitaciones

MesaNova es un prototipo académico y no un sistema comercial de producción.

- Los datos se almacenan localmente en el navegador mediante IndexedDB.
- No utiliza una base de datos centralizada ni un servidor backend.
- No existe sincronización de reservas entre dispositivos diferentes.
- Las pantallas de registro e inicio de sesión son demostrativas y no constituyen autenticación segura.
- El panel administrativo no implementa permisos de acceso reales.
- «Mis reservas» puede mostrar las reservas almacenadas localmente, sin aislamiento seguro por usuario.
- No incorpora pagos ni notificaciones automáticas.
- Se recomienda utilizar únicamente información ficticia durante las demostraciones.

La lógica de control de conflictos utiliza operaciones de almacenamiento local; no representa una garantía de disponibilidad en tiempo real entre múltiples dispositivos.

## 14. Repositorio y enlaces de entrega

**Repositorio de GitHub:** Pendiente de publicación.

**Prototipo de Figma:** Pendiente de insertar el enlace compartido.

**Informe de sustentación:** `docs/Sustentacion_Tecnica_MesaNova.pdf`.

Antes de la entrega se verificará que el docente pueda acceder al repositorio y al prototipo de Figma.

No se incluirá la carpeta `node_modules` en el repositorio.

## 15. Referencias

- React. (s. f.). *useState*. https://react.dev/reference/react/useState
- React. (s. f.). *useEffect*. https://react.dev/reference/react/useEffect
- Vite. (s. f.). *Getting started*. https://vite.dev/guide/
- World Wide Web Consortium. (s. f.). *Indexed Database API*. https://www.w3.org/TR/IndexedDB/
- Figma. (s. f.). *Figma Help Center*. https://help.figma.com/

---

**MesaNova — Proyecto académico de Desarrollo de Interfaces 2.**

**Integrantes:** Raymond Augusto Díaz Herrera, Sebastian Lopez Mendoza, Piero Navarro y Steven Nicolas Maylle Justo 