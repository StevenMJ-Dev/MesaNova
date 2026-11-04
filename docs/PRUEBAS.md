# Registro de verificación de MesaNova

**Fecha de actualización:** 4 de noviembre de 2026  
**Proyecto:** MesaNova — Sistema web de gestión de reservas para restaurantes  
**Tecnologías:** React, Vite, JavaScript e IndexedDB.

## 1. Objetivo de las pruebas

Verificar el funcionamiento del sistema MesaNova, especialmente el proceso de reservación, la selección de mesas, la modificación y cancelación de reservas, la persistencia de datos y las funcionalidades del panel administrativo.

Adicionalmente, se plantearon escenarios de evaluación de usabilidad para identificar posibles dificultades de navegación y oportunidades de mejora en la experiencia del usuario.

## 2. Pruebas automatizadas

Se ejecutó el comando:

```bash
npm test
```

**Resultados obtenidos:**

| Indicador | Resultado |
|---|---|
| Pruebas ejecutadas | 20 |
| Pruebas aprobadas | 20 |
| Pruebas fallidas | 0 |
| Pruebas omitidas | 0 |
| Porcentaje de aprobación | 100 % |

Las pruebas verificaron:

- Creación y validación de reservas.
- Selección explícita de mesas disponibles.
- Validación de capacidad de las mesas.
- Prevención de reservas duplicadas.
- Modificación y cancelación de reservas.
- Detección de horarios superpuestos.
- Validación de fechas y horarios.
- Validación de datos de contacto.
- Manejo de fechas según la zona horaria de Lima.
- Comportamiento ante alta demanda secuencial.
- Detección de datos persistidos inválidos.
- Manejo de conflictos al modificar registros.
- Rechazo de mesas ocupadas o con capacidad insuficiente.

La suite original contenía 17 casos y presentaba ocho fallos debido a que algunas pruebas no enviaban `tableId` después de incorporar la selección manual de mesas. Se actualizaron los datos de prueba y se agregaron tres casos adicionales, sin modificar la lógica de producción para resolver esos fallos.

El registro de ejecución se encuentra en `docs/pruebas_automatizadas.txt`.

## 3. Verificación de compilación

Se instalaron las dependencias mediante:

```bash
npm ci
```

Posteriormente, se ejecutó:

```bash
npm run build
```

**Resultado:** compilación exitosa con Vite 7.3.7.

- Módulos transformados: 44.
- Tiempo de compilación: 2.54 segundos.
- Carpeta generada: `dist/`.
- Errores de compilación: ninguno.

También se ejecutó `npm run dev` y se confirmó que la aplicación abrió correctamente en el navegador.

## 4. Verificaciones funcionales registradas

| Caso | Acción y resultado registrado |
|---|---|
| Formulario | Al intentar continuar sin completar los datos, aparecen validaciones. |
| Reserva | Se creó una reserva de prueba para dos personas, asignada a la mesa M1. |
| Persistencia | Al recargar la página, la reserva permaneció en «Mis reservas». |
| Modificación | Se cambió el horario manteniendo el mismo registro de reserva. |
| Cancelación | La reserva conservó su historial con estado «Cancelada». |
| Dos pestañas | Se comprobó la actualización del estado de cancelación entre pestañas. |
| Administración | Se utilizó la búsqueda y el filtro de reservas canceladas. |
| Vista móvil | Se revisó una vista de 390 px y se corrigió un problema de separación de palabras. |
| Prototipo HTML | Se verificó la navegación entre fecha, datos y revisión. |

Estas verificaciones corresponden al registro funcional previo del proyecto. No equivalen a pruebas de usabilidad realizadas con participantes externos.

**Capturas de referencia:**

- `evidencias/confirmacion.jpg`
- `evidencias/administracion.jpg`
- `evidencias/movil.jpg`

Las capturas deben conservarse en el proyecto para respaldar las verificaciones descritas.

## 5. Evaluación de usabilidad: escenarios de uso

Se diseñaron tres escenarios de evaluación con perfiles de diferentes edades y niveles de familiaridad tecnológica. Su finalidad es anticipar dificultades y establecer criterios para una validación posterior.

### Escenario 1: Hermano — 17 años

**Perfil:** Usuario joven familiarizado con aplicaciones web.

**Tarea:** Realizar una reserva para dos personas.

**Recorrido propuesto:**

1. Ingresar a la página principal.
2. Seleccionar «Reservar una mesa».
3. Elegir una fecha y un horario.
4. Indicar dos personas.
5. Seleccionar una mesa disponible.
6. Confirmar la reservación.

**Resultado esperado:** El usuario puede identificar las acciones principales y completar el proceso siguiendo las indicaciones de la interfaz.

**Posible dificultad:** Distinguir claramente qué mesa ha seleccionado antes de continuar.

**Mejora recomendada:** Mantener un resaltado visual evidente para la mesa seleccionada y mostrar un resumen antes de confirmar.

### Escenario 2: Tío — 45 años

**Perfil:** Usuario adulto con experiencia básica en páginas web.

**Tarea:** Consultar una reserva existente y cancelarla.

**Recorrido propuesto:**

1. Ingresar a MesaNova.
2. Localizar la sección «Mis reservas».
3. Identificar la reserva correspondiente.
4. Seleccionar la opción de cancelación.
5. Verificar el cambio de estado.

**Resultado esperado:** El usuario puede completar la cancelación mediante los controles disponibles.

**Posible dificultad:** No encontrar inmediatamente el acceso a «Mis reservas» o dudar si la cancelación se completó.

**Mejora recomendada:** Destacar el acceso a las reservas y mostrar un mensaje claro después de cancelar.

### Escenario 3: Amigo — 19 años

**Perfil:** Usuario joven familiarizado con herramientas digitales.

**Tarea:** Acceder al panel administrativo y localizar una reserva.

**Recorrido propuesto:**

1. Acceder al panel administrativo.
2. Revisar las estadísticas principales.
3. Utilizar el buscador de reservas.
4. Aplicar un filtro por estado.
5. Identificar la reserva solicitada.

**Resultado esperado:** El usuario puede comprender la organización del panel y localizar información mediante la búsqueda y los filtros.

**Posible dificultad:** Confundir los estados «Pendiente», «Confirmada» y «Cancelada».

**Mejora recomendada:** Utilizar etiquetas visibles y colores consistentes para distinguir los estados.

### Resumen de escenarios

| Perfil | Tarea | Dificultad potencial | Recomendación |
|---|---|---|---|
| Hermano, 17 años | Crear una reserva | Identificación de la mesa seleccionada | Mejorar resaltado visual |
| Tío, 45 años | Consultar y cancelar | Visibilidad de «Mis reservas» | Destacar acceso y confirmación |
| Amigo, 19 años | Buscar una reserva | Diferenciación de estados | Etiquetas y colores consistentes |

**Nota metodológica:** Estos escenarios son propuestas de evaluación y sus resultados son expectativas de uso. No se registraron observaciones, tiempos ni opiniones de participantes reales.

## 6. Hallazgos técnicos y mejoras implementadas

Durante el desarrollo y la verificación se identificaron los siguientes problemas:

| Problema identificado | Solución implementada |
|---|---|
| La vista previa rechazaba el host de prueba | Se configuró el host correspondiente en Vite. |
| Web Locks no estaba disponible en el entorno HTTP de prueba | Se utilizaron transacciones IndexedDB. |
| `randomUUID` no estaba disponible en ese contexto | Se incorporó una alternativa UUID v4 mediante `getRandomValues`. |
| Al corregir un campo se ocultaban otros errores | Se modificó la validación para limpiar únicamente el error del campo editado. |
| JavaScript normalizaba fechas inexistentes | Se incorporó una validación estricta de fechas ISO. |
| En la vista móvil algunas palabras aparecían unidas | Se corrigieron los espacios y se revisó la presentación. |

## 7. Limitaciones

Las pruebas automatizadas validan reglas de negocio, pero no sustituyen una evaluación de experiencia de usuario.

No se realizaron entrevistas, mediciones de satisfacción SUS ni pruebas de usabilidad con participantes externos.

Tampoco se verificó el comportamiento bajo carga simultánea de múltiples usuarios ni en todos los navegadores y dispositivos físicos.

## 8. Conclusiones

MesaNova superó satisfactoriamente las 20 pruebas automatizadas y completó su compilación de producción sin errores.

Las verificaciones funcionales registradas permiten documentar el funcionamiento de las operaciones principales de reserva, modificación, cancelación y administración.

Los escenarios de usabilidad propuestos permiten identificar aspectos que conviene evaluar posteriormente, especialmente la claridad de la selección de mesas, la visibilidad de «Mis reservas» y la identificación de estados administrativos.

Como siguiente actividad se recomienda realizar estas tareas con participantes reales, registrar sus observaciones y aplicar las mejoras necesarias.