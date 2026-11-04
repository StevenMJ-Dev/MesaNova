
/* =========================================================
   MESANOVA - SISTEMA DE RESERVACIONES
   Reglas compartidas por la interfaz y las pruebas.
   Todas las fechas y horarios corresponden a Lima, Perú.
   ========================================================= */

// CONFIGURACIÓN GENERAL

export const TIME_ZONE = 'America/Lima';

export const DURATION = 90;

export const TABLES = [
  { id: 'M1', seats: 2 },
  { id: 'M2', seats: 2 },
  { id: 'M3', seats: 4 },
  { id: 'M4', seats: 4 },
  { id: 'M5', seats: 6 },
  { id: 'M6', seats: 6 }
];

export const SLOTS = [
  '12:00',
  '13:30',
  '15:00',
  '18:00',
  '19:30',
  '21:00'
];

/* =========================================================
   FUNCIONES DE FECHAS Y HORARIOS
   ========================================================= */

// Obtener la fecha actual en Lima
export function today(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);

  const year = parts.find((p) => p.type === 'year').value;
  const month = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;

  return `${year}-${month}-${day}`;
}

// Sumar días a una fecha
export function addDays(date, number) {
  const result = new Date(`${date}T12:00:00Z`);

  result.setUTCDate(result.getUTCDate() + number);

  return result.toISOString().slice(0, 10);
}

// Mostrar fechas en español
export function displayDate(date) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T12:00:00Z`));
}

// Convertir una hora a minutos
export function minutes(time) {
  const [hours, mins] = time.split(':').map(Number);

  return hours * 60 + mins;
}

// Verificar si dos reservas se superponen
export function overlaps(a, b) {
  return (
    a.date === b.date &&
    Math.abs(minutes(a.time) - minutes(b.time)) < DURATION
  );
}

// Comprobar que el horario no haya pasado
export function future(date, time, now = new Date()) {
  const reservationDate = new Date(
    `${date}T${time}:00-05:00`
  );

  return reservationDate.getTime() > now.getTime();
}

/* =========================================================
   DISPONIBILIDAD DE MESAS
   ========================================================= */

export function availableTables(
  records,
  date,
  time,
  guests,
  ignoreId,
  now = new Date()
) {
  const numberOfGuests = Number(guests);

  // Validar horario y cantidad de personas
  if (
    !SLOTS.includes(time) ||
    !Number.isInteger(numberOfGuests) ||
    numberOfGuests < 1 ||
    numberOfGuests > 6 ||
    !future(date, time, now)
  ) {
    return [];
  }

  // Filtrar mesas con capacidad y disponibilidad
  return TABLES.filter((table) => {
    const hasCapacity = table.seats >= numberOfGuests;

    const isOccupied = records.some(
      (reservation) =>
        reservation.id !== ignoreId &&
        reservation.status === 'confirmed' &&
        reservation.tableId === table.id &&
        overlaps(reservation, { date, time })
    );

    return hasCapacity && !isOccupied;
  });
}

/* =========================================================
   VALIDACIONES
   ========================================================= */

// Validar una fecha en formato YYYY-MM-DD
function validDate(date) {
  if (
    typeof date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T12:00:00Z`);

  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

// Validar los datos del cliente
export function validateDetails(
  details,
  now = new Date()
) {
  const errors = {};

  // Fecha
  if (
    !validDate(details.date) ||
    details.date < today(now) ||
    details.date > addDays(today(now), 90)
  ) {
    errors.date =
      'Elige una fecha entre hoy y los próximos 90 días.';
  }

  // Horario
  if (
    !SLOTS.includes(details.time) ||
    !future(details.date, details.time, now)
  ) {
    errors.time =
      'Elige un horario disponible que aún no haya pasado.';
  }

  // Cantidad de personas
  const guests = Number(details.guests);

  if (
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 6
  ) {
    errors.guests =
      'La reserva admite de 1 a 6 personas.';
  }

  // Nombre
  if (
    typeof details.name !== 'string' ||
    details.name.trim().length < 3 ||
    details.name.trim().length > 80
  ) {
    errors.name =
      'Escribe tu nombre completo (de 3 a 80 caracteres).';
  }

  // Correo electrónico
  if (
    typeof details.email !== 'string' ||
    !/^\S+@\S+\.\S+$/.test(details.email.trim()) ||
    details.email.length > 120
  ) {
    errors.email =
      'Revisa tu correo electrónico.';
  }

  // Celular peruano
  if (
    typeof details.phone !== 'string' ||
    !/^9\d{8}$/.test(details.phone.trim())
  ) {
    errors.phone =
      'Ingresa un celular peruano de 9 dígitos que empiece con 9.';
  }

  // Comentarios
  if (
    typeof details.notes === 'string' &&
    details.notes.length > 240
  ) {
    errors.notes =
      'Usa como máximo 240 caracteres.';
  }

  return errors;
}

/* =========================================================
   GENERACIÓN DE IDENTIFICADORES
   ========================================================= */

export function makeId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const bytes = globalThis.crypto.getRandomValues(
    new Uint8Array(16)
  );

  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;

  const hex = Array.from(
    bytes,
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-');
}

/* =========================================================
   CREAR O MODIFICAR RESERVACIONES
   ========================================================= */

export function createReservation(
  records,
  details,
  { ignoreId = null, now = new Date(), id = makeId() } = {}
) {
  // Validar información del cliente
  const errors = validateDetails(details, now);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: 'Revisa los campos marcados.'
    };
  }

  const email = details.email.trim().toLowerCase();

  // Evitar reservas duplicadas del mismo correo
  const duplicate = records.some(
    (reservation) =>
      reservation.id !== ignoreId &&
      reservation.status === 'confirmed' &&
      reservation.email === email &&
      overlaps(reservation, details)
  );

  if (duplicate) {
    return {
      ok: false,
      message:
        'Ya existe una reserva de este correo en ese horario. Puedes modificarla desde Mis reservas.'
    };
  }

  // Comprobar que la reserva exista si se está editando
  if (
    ignoreId &&
    !records.some(
      (reservation) =>
        reservation.id === ignoreId &&
        reservation.status === 'confirmed'
    )
  ) {
    return {
      ok: false,
      message:
        'La reserva cambió o fue cancelada. Actualiza la lista.'
    };
  }

  // Consultar las mesas disponibles
  const candidates = availableTables(
    records,
    details.date,
    details.time,
    details.guests,
    ignoreId,
    now
  );

  if (!candidates.length) {
    return {
      ok: false,
      message:
        'Ese horario acaba de quedarse sin mesas. Elige otro horario.'
    };
  }

  // Validar la mesa elegida por el cliente
  const selectedTable = candidates.find(
    (table) => table.id === details.tableId
  );

  if (!selectedTable) {
    return {
      ok: false,
      errors: {
        tableId:
          'Selecciona una mesa disponible para tu horario y cantidad de personas.'
      },
      message:
        'La mesa seleccionada no está disponible. Elige otra mesa.'
    };
  }

  // Conservar la fecha de creación al editar
  const previous = records.find(
    (reservation) => reservation.id === ignoreId
  );

  // Construir la reserva
  const reservation = {
    id: ignoreId || id,
    name: details.name.trim(),
    email,
    phone: details.phone.trim(),
    notes: (details.notes || '').trim(),
    date: details.date,
    time: details.time,
    guests: Number(details.guests),
    tableId: selectedTable.id,
    status: 'confirmed',
    createdAt: previous?.createdAt || now.toISOString()
  };

  // Actualizar o agregar la reserva
  const updatedRecords = ignoreId
    ? records.map((record) =>
        record.id === ignoreId ? reservation : record
      )
    : [...records, reservation];

  return {
    ok: true,
    reservation,
    records: updatedRecords
  };
}

/* =========================================================
   CANCELAR RESERVACIONES
   ========================================================= */

export function cancelReservation(records, id) {
  const reservation = records.find(
    (record) => record.id === id
  );

  if (
    !reservation ||
    reservation.status !== 'confirmed'
  ) {
    return {
      ok: false,
      message: 'La reserva ya no está activa.'
    };
  }

  return {
    ok: true,
    records: records.map((record) =>
      record.id === id
        ? { ...record, status: 'cancelled' }
        : record
    )
  };
}

/* =========================================================
   VALIDAR RESERVAS ALMACENADAS
   ========================================================= */

export function validStoredRecord(record) {
  return (
    !!record &&
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.email === 'string' &&
    typeof record.phone === 'string' &&
    typeof record.notes === 'string' &&
    validDate(record.date) &&
    SLOTS.includes(record.time) &&
    Number.isInteger(record.guests) &&
    record.guests >= 1 &&
    record.guests <= 6 &&
    TABLES.some(
      (table) =>
        table.id === record.tableId &&
        table.seats >= record.guests
    ) &&
    ['confirmed', 'cancelled'].includes(record.status)
  );
}
