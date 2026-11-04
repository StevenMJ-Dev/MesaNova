
import { useEffect, useRef, useState } from 'react';
import Calendar from './Calendar';
import TableSelector from './TableSelector';

import {
  SLOTS,
  availableTables,
  displayDate,
  today,
  validateDetails
} from '../lib/reservations';

export default function ReservationForm({
  records,
  now,
  save,
  initial,
  onDone,
  onClose
}) {
  const [step, setStep] = useState(1);

  const [data, setData] = useState(() => ({
    date: today(now),
    time: '',
    guests: 2,
    tableId: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    ...(initial || {})
  }));

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const heading = useRef(null);

  useEffect(() => {
    heading.current?.focus();
  }, [step]);

  // Actualizar campos del formulario
  const set = (key, value) => {
    setData((previous) => ({
      ...previous,
      [key]: value,
      ...(['date', 'guests'].includes(key)
        ? { time: '', tableId: '' }
        : key === 'time'
          ? { tableId: '' }
          : {})
    }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];

      if (['date', 'guests'].includes(key)) {
        delete next.time;
        delete next.tableId;
      }

      if (key === 'time') {
        delete next.tableId;
      }

      return next;
    });

    setMessage('');
  };

  // Mesas disponibles según fecha, hora y personas
  const available = availableTables(
    records,
    data.date,
    data.time,
    data.guests,
    initial?.id,
    now
  );

  const selectedTableAvailable = available.some(
    (table) => table.id === data.tableId
  );

  // Validar datos antes de confirmar
  function details(event) {
    event.preventDefault();

    const validationErrors = validateDetails(data, now);

    if (!selectedTableAvailable) {
      validationErrors.tableId =
        'Selecciona una mesa disponible.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setMessage('Revisa los campos marcados.');
      return;
    }

    setMessage('');
    setStep(3);
  }

  // Guardar la reservación
  async function confirm() {
    if (busy) return;

    setBusy(true);

    try {
      const result = await save(data, initial?.id);

      if (result.ok) {
        onDone(result.reservation);
      } else {
        setMessage(result.message);
        setErrors(result.errors || {});

        if (result.errors?.tableId || result.errors?.time) {
          setStep(1);
        } else if (result.errors) {
          setStep(2);
        }
      }
    } catch {
      setMessage(
        'No se pudo guardar la reserva. Inténtalo nuevamente.'
      );
    } finally {
      setBusy(false);
    }
  }

  // Campos reutilizables
  const field = (id, label, type = 'text', attrs = {}) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        value={data[id]}
        onChange={(event) => set(id, event.target.value)}
        aria-invalid={!!errors[id]}
        aria-describedby={
          errors[id] ? `${id}-error` : undefined
        }
        {...attrs}
      />

      {errors[id] && (
        <span
          id={`${id}-error`}
          className="field-error"
        >
          {errors[id]}
        </span>
      )}
    </div>
  );

  return (
    <div className="booking-card">
      {/* ENCABEZADO */}
      <div className="booking-top">
        <span className="eyebrow">
          {initial
            ? 'MODIFICAR RESERVA'
            : 'TU PRÓXIMO ENCUENTRO'}
        </span>

        {onClose && (
          <button
            type="button"
            className="text-button"
            onClick={onClose}
          >
            Salir de edición
          </button>
        )}
      </div>

      <h2 ref={heading} tabIndex="-1">
        {step === 1
          ? 'Encuentra tu mesa'
          : step === 2
            ? 'Cuéntanos quién viene'
            : 'Revisa tu reserva'}
      </h2>

      {/* INDICADOR DE PASOS */}
      <ol className="steps" aria-label="Progreso de reserva">
        {[
          'Fecha, hora y mesa',
          'Tus datos',
          'Confirmación'
        ].map((label, index) => (
          <li
            key={label}
            className={
              step === index + 1
                ? 'active'
                : step > index + 1
                  ? 'done'
                  : ''
            }
            aria-current={
              step === index + 1 ? 'step' : undefined
            }
          >
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {/* MENSAJES */}
      {message && (
        <div className="alert error" role="alert">
          {message}
        </div>
      )}

      {/* =====================================
          PASO 1: FECHA, HORA Y MESA
          ===================================== */}
      {step === 1 && (
        <>
          <div className="form-columns">
            {/* FECHA Y PERSONAS */}
            <div>
              <label
                className="section-label"
                htmlFor="guests"
              >
                ¿Cuántas personas vienen?
              </label>

              <select
                id="guests"
                value={data.guests}
                onChange={(event) =>
                  set('guests', Number(event.target.value))
                }
              >
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <option key={number} value={number}>
                    {number}{' '}
                    {number === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>

              <Calendar
                value={data.date}
                onChange={(value) => set('date', value)}
                now={now}
              />
            </div>

            {/* HORARIOS */}
            <div>
              <p className="section-label">
                Horarios disponibles
              </p>

              <p className="muted date-display">
                {displayDate(data.date)}
              </p>

              <div className="slots">
                {SLOTS.map((time) => {
                  const count = availableTables(
                    records,
                    data.date,
                    time,
                    data.guests,
                    initial?.id,
                    now
                  ).length;

                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={!count}
                      className={`slot ${
                        data.time === time
                          ? 'selected'
                          : ''
                      }`}
                      aria-pressed={data.time === time}
                      aria-label={`${time}, ${
                        count
                          ? `${count} mesas disponibles`
                          : 'no disponible'
                      }`}
                      onClick={() => set('time', time)}
                    >
                      <strong>{time}</strong>

                      <small>
                        {count
                          ? `${count} ${
                              count === 1
                                ? 'mesa'
                                : 'mesas'
                            }`
                          : 'No disponible'}
                      </small>
                    </button>
                  );
                })}
              </div>

              <div className="info-box">
                <strong>
                  Una mesa, sin cruces.
                </strong>

                <p>
                  Cada reserva dura 90 minutos.
                  Selecciona una mesa disponible
                  según el tamaño de tu grupo.
                </p>
              </div>

              {!SLOTS.some(
                (time) =>
                  availableTables(
                    records,
                    data.date,
                    time,
                    data.guests,
                    initial?.id,
                    now
                  ).length > 0
              ) && (
                <p
                  role="status"
                  className="field-error"
                >
                  No quedan horarios para esta fecha.
                  Prueba otro día.
                </p>
              )}
            </div>
          </div>

          {/* SELECCIÓN VISUAL DE LAS SEIS MESAS */}
          {data.time && (
            <TableSelector
              records={records}
              date={data.date}
              time={data.time}
              guests={data.guests}
              selectedTable={data.tableId}
              onSelect={(tableId) =>
                set('tableId', tableId)
              }
              ignoreId={initial?.id}
              now={now}
            />
          )}

          {errors.tableId && (
            <p className="field-error" role="alert">
              {errors.tableId}
            </p>
          )}

          <button
            type="button"
            className="primary full"
            disabled={
              !data.time ||
              !selectedTableAvailable
            }
            onClick={() => {
              setMessage('');
              setStep(2);
            }}
          >
            Continuar con mis datos{' '}
            <span aria-hidden="true">→</span>
          </button>

          <p className="hint centered">
            Sin pagos anticipados · Confirmación
            inmediata en pantalla
          </p>
        </>
      )}

      {/* =====================================
          PASO 2: DATOS DEL CLIENTE
          ===================================== */}
      {step === 2 && (
        <form noValidate onSubmit={details}>
          <div className="selection-summary">
            {displayDate(data.date)} · {data.time} ·{' '}
            {data.guests}{' '}
            {data.guests === 1
              ? 'persona'
              : 'personas'}{' '}
            · Mesa {data.tableId.replace('M', '')}
          </div>

          {field(
            'name',
            'Nombre completo',
            'text',
            {
              autoComplete: 'name',
              maxLength: 80
            }
          )}

          <div className="two-cols">
            {field(
              'email',
              'Correo electrónico',
              'email',
              {
                autoComplete: 'email',
                maxLength: 120
              }
            )}

            {field(
              'phone',
              'Celular',
              'tel',
              {
                autoComplete: 'tel',
                inputMode: 'numeric',
                maxLength: 9,
                placeholder: '9 dígitos'
              }
            )}
          </div>

          <div className="field">
            <label htmlFor="notes">
              Comentario para el restaurante{' '}
              <span className="muted">
                (opcional)
              </span>
            </label>

            <textarea
              id="notes"
              value={data.notes}
              maxLength={240}
              rows={3}
              onChange={(event) =>
                set('notes', event.target.value)
              }
            />

            <span className="hint">
              {data.notes.length}/240 · No incluyas
              información sensible.
            </span>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setMessage('');
                setStep(1);
              }}
            >
              Volver
            </button>

            <button
              className="primary"
              type="submit"
            >
              Revisar reserva →
            </button>
          </div>
        </form>
      )}

      {/* =====================================
          PASO 3: CONFIRMACIÓN
          ===================================== */}
      {step === 3 && (
        <>
          <div className="review">
            <div>
              <span>Fecha y hora</span>
              <strong>
                {displayDate(data.date)} · {data.time}
              </strong>
            </div>

            <div>
              <span>Personas</span>
              <strong>{data.guests}</strong>
            </div>

            <div>
              <span>Mesa seleccionada</span>
              <strong>
                Mesa {data.tableId.replace('M', '')}
              </strong>
            </div>

            <div>
              <span>A nombre de</span>
              <strong>{data.name}</strong>
            </div>

            <div>
              <span>Contacto</span>
              <strong>
                {data.email}
                <br />
                {data.phone}
              </strong>
            </div>

            {data.notes && (
              <div>
                <span>Comentario</span>
                <strong>{data.notes}</strong>
              </div>
            )}
          </div>

          <p className="hint">
            La mesa se confirma al guardar.
            Puedes cancelar después desde
            Mis reservas.
          </p>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setMessage('');
                setStep(2);
              }}
            >
              Corregir datos
            </button>

            <button
              type="button"
              className="primary"
              disabled={busy}
              onClick={confirm}
            >
              {busy
                ? 'Guardando…'
                : initial
                  ? 'Guardar cambios'
                  : 'Confirmar reserva'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
