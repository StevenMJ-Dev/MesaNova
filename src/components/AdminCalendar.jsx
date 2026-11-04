
import { useState } from 'react';
import {
  displayDate,
  today
} from '../lib/reservations';

export default function AdminCalendar({
  records,
  now
}) {
  const [selectedDate, setSelectedDate] = useState(
    today(now)
  );

  const [month, setMonth] = useState(
    today(now).slice(0, 7)
  );

  // Primer día del mes
  const firstDay = new Date(
    `${month}-01T12:00:00Z`
  );

  // Lunes como primer día de la semana
  const offset = (firstDay.getUTCDay() + 6) % 7;

  // Cantidad de días del mes
  const daysInMonth = new Date(
    Date.UTC(
      firstDay.getUTCFullYear(),
      firstDay.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  // Reservas confirmadas
  const confirmed = records.filter(
    (reservation) =>
      reservation.status === 'confirmed'
  );

  // Fechas que tienen reservas
  const datesWithReservations = new Set(
    confirmed.map((reservation) => reservation.date)
  );

  // Reservas del día seleccionado
  const selectedReservations = confirmed
    .filter(
      (reservation) =>
        reservation.date === selectedDate
    )
    .sort((a, b) =>
      a.time.localeCompare(b.time)
    );

  function moveMonth(amount) {
    const next = new Date(firstDay);

    next.setUTCMonth(
      next.getUTCMonth() + amount
    );

    setMonth(next.toISOString().slice(0, 7));
  }

  const monthTitle = new Intl.DateTimeFormat(
    'es-PE',
    {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }
  ).format(firstDay);

  return (
    <section className="admin-calendar">

      <div className="admin-calendar-title">
        <div>
          <h2>Calendario de reservas</h2>
          <p>
            Consulta las fechas y reservas del restaurante.
          </p>
        </div>
      </div>

      <div className="admin-calendar-layout">

        {/* CALENDARIO */}
        <div className="admin-calendar-main">

          <div className="admin-calendar-header">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => moveMonth(-1)}
            >
              ‹
            </button>

            <h3>{monthTitle}</h3>

            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => moveMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="admin-calendar-days">

            {[
              'Lu', 'Ma', 'Mi', 'Ju',
              'Vi', 'Sá', 'Do'
            ].map((day) => (
              <span
                className="admin-weekday"
                key={day}
              >
                {day}
              </span>
            ))}

            {Array.from(
              { length: offset },
              (_, index) => (
                <span key={`empty-${index}`} />
              )
            )}

            {Array.from(
              { length: daysInMonth },
              (_, index) => {
                const date = `${month}-${String(
                  index + 1
                ).padStart(2, '0')}`;

                const hasReservations =
                  datesWithReservations.has(date);

                const isSelected =
                  selectedDate === date;

                return (
                  <button
                    type="button"
                    key={date}
                    aria-label={displayDate(date)}
                    aria-pressed={isSelected}
                    className={[
                      'admin-calendar-day',
                      hasReservations
                        ? 'has-reservations'
                        : '',
                      isSelected
                        ? 'is-selected'
                        : ''
                    ].join(' ')}
                    onClick={() =>
                      setSelectedDate(date)
                    }
                  >
                    {index + 1}
                  </button>
                );
              }
            )}

          </div>

          <div className="admin-calendar-legend">
            <span>
              <i className="legend-reserved" />
              Días con reservas
            </span>

            <span>
              <i className="legend-selected" />
              Día seleccionado
            </span>
          </div>

        </div>

        {/* RESERVAS DEL DÍA */}
        <aside className="admin-calendar-detail">

          <h3>
            {displayDate(selectedDate)}
          </h3>

          <p>
            {selectedReservations.length}{' '}
            {selectedReservations.length === 1
              ? 'reserva confirmada'
              : 'reservas confirmadas'}
          </p>

          {selectedReservations.length === 0 ? (
            <div className="admin-calendar-empty">
              No hay reservas confirmadas
              para esta fecha.
            </div>
          ) : (
            <div className="admin-calendar-bookings">
              {selectedReservations.map(
                (reservation) => (
                  <div
                    className="admin-calendar-booking"
                    key={reservation.id}
                  >
                    <strong>
                      {reservation.time}
                    </strong>

                    <span>
                      {reservation.name}
                    </span>

                    <small>
                      {reservation.guests} personas
                      {' · '}
                      Mesa{' '}
                      {reservation.tableId.replace(
                        'M',
                        ''
                      )}
                    </small>
                  </div>
                )
              )}
            </div>
          )}

        </aside>

      </div>

    </section>
  );
}
