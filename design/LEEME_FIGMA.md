# Llevar MesaNova a Figma

## Estado de la entrega

Se prepararon 11 pantallas editables (9 estados y 2 wireframes), un prototipo HTML navegable y el código de un plugin local para crear capas y conexiones. **Todavía no hay un prototipo completo compartido en Figma.** La integración llegó al límite de operaciones del plan Starter antes de incorporar las pantallas. No se ha comprobado el resultado del plugin dentro de Figma.

El archivo iniciado en la sesión es https://www.figma.com/design/hk7Lsg3zsjIWqMv06p55kA ; es solo un destino de trabajo pendiente, no el enlace de un prototipo terminado.

## Opción 1: plugin de desarrollo en Figma Desktop

1. Abrir Figma Desktop y un archivo Design editable.
2. En el menú de plugins de desarrollo, usar «New plugin» / «Create new plugin». Crear un plugin para Figma Design, sin interfaz. Guardar la carpeta generada.
3. Mantener el `id` que Figma haya asignado en su `manifest.json`. No utilizar el identificador de ejemplo.
4. Reemplazar el `code.js` de esa carpeta por `design/figma-plugin/code.js` de esta entrega.
5. En el manifiesto generado, comprobar `main: "code.js"`, `api: "1.0.0"`, `editorType: ["figma"]`, `documentAccess: "dynamic-page"` y `networkAccess: {"allowedDomains": ["none"]}`. `manifest.ejemplo.json` muestra la estructura, pero requiere el ID real asignado por Figma.
6. Ejecutar el plugin desde Plugins > Development. Crea una página nueva, sin borrar las existentes. Ejecutarlo más de una vez genera otra copia.
7. Revisar los 11 frames, el componente de botón y las conexiones. Se declaran dos puntos de inicio, Cliente y Administrador, con disolución de 250 ms.
8. Pulsar Presentar, recorrer cada flujo y corregir cualquier diferencia visual. Comprobar especialmente textos, navegación y retorno tras cancelar.
9. Compartir con permiso de lectura adecuado para el docente y copiar el enlace del prototipo en el informe.

Este generador no usa red ni librerías externas. La comprobación `node --check code.js` valida su sintaxis JavaScript, no la ejecución de la API de Figma.

## Opción 2: SVG y conexiones manuales

Arrastrar los SVG de `wireframes/` a Figma, colocar cada pantalla dentro de un frame de 1200 × 800 y agregar las interacciones desde Prototype. Los textos pueden requerir ajustes según la fuente disponible.

Flujo principal: fecha → datos → revisión → confirmación → mis reservas.
Flujo de cancelación: mis reservas o administración → confirmar cancelación → reserva cancelada.
Caso alternativo: sin disponibilidad → fecha.

Usar «On click > Navigate to», transición Dissolve de 250 ms. Los valores del diseño son simulados. La aplicación permite introducir valores reales de prueba y calcula disponibilidad; el prototipo usa un ejemplo fijo de 2 personas, 3 de noviembre de 2026, 13:30. No presentar los botones de horario del diseño como un motor de reservas.

## Revisión rápida sin Figma

Abrir `prototipo_interactivo.html`. Los botones y el selector superior permiten recorrer las pantallas. El HTML incluye sus recursos y funciona sin conexión. Se comprobó la navegación de fecha a datos y a revisión. El comportamiento de los demás enlaces se define en `screens.json`.
