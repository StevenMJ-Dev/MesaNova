
import { useEffect, useState } from 'react';
import {
  addDays,
  displayDate,
  today
} from '../lib/reservations';

export default function Calendar({ value, onChange, now }) {
  const [month, setMonth] = useState(() => value.slice(0, 7));

  useEffect(() => {
    setMonth(value.slice(0, 7));
  }, [value]);

  const first = new Date(`${month}-01T12:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;

  const count = new Date(
    Date.UTC(
      first.getUTCFullYear(),
      first.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  const min = today(now);
  const max = addDays(min, 90);

  function move(amount) {
    const next = new Date(first);
    next.setUTCMonth(next.getUTCMonth() + amount);
    setMonth(next.toISOString().slice(0, 7));
  }

  return (
    <section className="calendar" aria-label="Calendario de reservas">
      <div className="calendar-head">
        <button
          type="button"
          className="icon-button"
          aria-label="Mes anterior"
          disabled={month <= min.slice(0, 7)}
          onClick={() => move(-1)}
        >
          ‹
        </button>

        <strong>
          {new Intl.DateTimeFormat('es-PE', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
          }).format(first)}
        </strong>

        <button
          type="button"
          className="icon-button"
          aria-label="Mes siguiente"
          disabled={month >= max.slice(0, 7)}
          onClick={() => move(1)}
        >
          ›
        </button>
      </div>

      <div className="days">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(day => (
          <span className="weekday" key={day}>
            {day}
          </span>
        ))}

        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: count }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, '0')}`;

          return (
            <button
              type="button"
              key={date}
              aria-label={displayDate(date)}
              aria-pressed={value === date}
              className={value === date ? 'selected' : ''}
              disabled={date < min || date > max}
              onClick={() => onChange(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <p className="hint">
        Hora de Lima · Reservas hasta 90 días antes.
      </p>
    </section>
  );
}
