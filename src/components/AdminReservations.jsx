
import { useState } from 'react';
import {
  displayDate,
  future
} from '../lib/reservations';

export default function AdminReservations({
  records,
  now,
  onEdit,
  onCancel
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const visible = records
    .filter((reservation) => {
      const search = query.trim().toLowerCase();

      const matchesSearch = [
        reservation.name,
        reservation.email,
        reservation.id,
        reservation.tableId
      ].some((value) =>
        value.toLowerCase().includes(search)
      );

      const matchesStatus =
        status === 'all' ||
        reservation.status === status;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      (b.date + b.time).localeCompare(a.date + a.time)
    );

  return (
    <section className="admin-reservations">
      <div className="admin-table-heading">
        <div>
          <h2>Reservas recientes</h2>
          <p>
            Consulta y administra las reservas
            de MesaNova.
          </p>
        </div>

        <span className="admin-count">
          {visible.length} resultados
        </span>
      </div>

      <div className="admin-table-filters">
        <input
          type="search"
          aria-label="Buscar reservas"
          placeholder="Buscar por cliente, correo o mesa..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="all">Todos los estados</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Personas</th>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <strong>{reservation.name}</strong>
                  <small>{reservation.email}</small>
                </td>

                <td>
                  {displayDate(reservation.date)}
                </td>

                <td>{reservation.time}</td>

                <td>{reservation.guests}</td>

                <td>
                  Mesa {reservation.tableId.replace('M', '')}
                </td>

                <td>
                  <span
                    className={`badge ${reservation.status}`}
                  >
                    {reservation.status === 'confirmed'
                      ? 'Confirmada'
                      : 'Cancelada'}
                  </span>
                </td>

                <td>
                  {reservation.status === 'confirmed' &&
                  future(
                    reservation.date,
                    reservation.time,
                    now
                  ) ? (
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        onClick={() => onEdit(reservation)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => onCancel(reservation)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!visible.length && (
          <div className="empty">
            <h3>No se encontraron reservas</h3>
            <p>
              Prueba cambiando los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
