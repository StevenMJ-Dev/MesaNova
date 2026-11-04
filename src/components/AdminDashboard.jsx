
import { displayDate, future } from '../lib/reservations';

export default function AdminDashboard({
  records,
  now,
  onViewReservations
}) {
  const confirmed = records
    .filter((r) => r.status === 'confirmed')
    .sort((a, b) =>
      (b.date + b.time).localeCompare(a.date + a.time)
    );

  const upcoming = records
    .filter(
      (r) =>
        r.status === 'confirmed' &&
        future(r.date, r.time, now)
    )
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    )
    .slice(0, 4);

  return (
    <div className="admin-dashboard-grid">

      {/* RESERVAS CONFIRMADAS */}
      <section className="admin-dashboard-card">
        <div className="admin-dashboard-heading">
          <h2>Reservas confirmadas</h2>
          <p>Últimas reservas registradas.</p>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {confirmed.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{displayDate(r.date)}</td>
                  <td>{r.time}</td>
                  <td>{r.guests}</td>
                  <td>
                    <span className="badge confirmed">
                      Confirmada
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {confirmed.length === 0 && (
            <p className="admin-dashboard-empty">
              Todavía no hay reservas confirmadas.
            </p>
          )}
        </div>
      </section>

      {/* PRÓXIMAS RESERVAS */}
      <section className="admin-dashboard-card">
        <div className="admin-dashboard-heading">
          <h2>Próximas reservas</h2>
          <p>Reservas que están por realizarse.</p>
        </div>

        <div className="admin-upcoming-list">
          {upcoming.map((r) => (
            <div className="admin-upcoming-item" key={r.id}>
              <div>
                <strong>{r.name}</strong>
                <p>
                  {displayDate(r.date)} · {r.time}
                </p>
              </div>

              <span>{r.guests} pers.</span>
            </div>
          ))}

          {upcoming.length === 0 && (
            <p className="admin-dashboard-empty">
              No hay próximas reservas.
            </p>
          )}
        </div>

        <button
          type="button"
          className="primary"
          onClick={onViewReservations}
        >
          Ver todas las reservas
        </button>
      </section>

    </div>
  );
}
