import { useState } from 'react';
import useReservations from './hooks/useReservations';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import AdminReservations from './components/AdminReservations';
import AdminCalendar from './components/AdminCalendar';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import ConfirmDialog from './components/ConfirmDialog';

import {
  displayDate,
  today,
  TABLES,
  DURATION,
  minutes
} from './lib/reservations';

import './App.css';

export default function App() {
  const { records, error, now, save, cancel } = useReservations();

  const [view, setView] = useState('home');
  const [editing, setEditing] = useState(null);
  const [adminSection, setAdminSection] = useState('inicio');
  const [confirmed, setConfirmed] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  function navigate(v) {
    setView(v);
    setEditing(null);
    setConfirmed(null);
  }

  // ESTADÍSTICAS DEL ADMINISTRADOR
  const todays = records.filter(
    (r) =>
      r.date === today(now) &&
      r.status === 'confirmed'
  );

  const cancelled = records.filter(
    (r) => r.status === 'cancelled'
  );

  const pending = records.filter(
    (r) => r.status === 'pending'
  );

  // Hora actual de Lima
  const limaTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Lima',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(now);

  const currentMinutes = minutes(limaTime);

  // Mesas ocupadas actualmente
  const occupiedTableIds = new Set(
    todays
      .filter((r) => {
        const start = minutes(r.time);

        return (
          currentMinutes >= start &&
          currentMinutes < start + DURATION
        );
      })
      .map((r) => r.tableId)
  );

  const occupancy = Math.round(
    (occupiedTableIds.size / TABLES.length) * 100
  );

  return (
    <>
      <a className="skip" href="#main">
        Ir al contenido
      </a>

      {/* CABECERA */}
      <header className="site-header">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('home');
          }}
        >
          <span className="brand-symbol" aria-hidden="true">
            M
          </span>

          <span>
            MesaNova
            <span className="brand-sub">
              RESTAURANTE & EXPERIENCIAS
            </span>
          </span>
        </a>

        <nav aria-label="Navegación principal">
          {[
            ['home', 'Inicio'],
            ['reserve', 'Reservar una mesa'],
            ['mine', 'Mis reservas'],
            ['login', 'Iniciar sesión'],
            ['register', 'Crear cuenta']
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={view === id ? 'nav-active' : ''}
              aria-current={view === id ? 'page' : undefined}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* AVISO DEL PROTOTIPO */}
      <div className="demo-bar">
        <span className="dot" />
        Prototipo académico · Datos de prueba guardados en este navegador
        · Administración de demostración
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main id="main">
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        {/* PÁGINA PRINCIPAL */}
        {view === 'home' && !editing ? (
          <Home onReserve={() => navigate('reserve')} />

        ) : view === 'login' && !editing ? (
          <Login
            onLogin={(role, email) => {
              console.log(
                'Acceso de demostración:',
                role,
                email
              );

              navigate(
                role === 'admin' ? 'admin' : 'home'
              );
            }}
            onRegister={() => navigate('register')}
          />

        ) : view === 'register' && !editing ? (
          <Register
            onRegister={(user) => {
              console.log('Registro de demostración:', user);
              navigate('login');
            }}
            onLogin={() => navigate('login')}
          />

        ) : view === 'reserve' || editing ? (

          /* RESERVACIÓN */
          <div className="reserve-layout">
            <aside className="intro">
              <span className="eyebrow">
                BUENA COMIDA. MEJOR COMPAÑÍA.
              </span>

              <h1>
                El encuentro <br />
                empieza con <br />
                <em>una mesa.</em>
              </h1>

              <p>
                Elige el día, encuentra tu horario y ven a disfrutar.
                Nosotros nos encargamos de guardar tu lugar.
              </p>

              <div className="restaurant-meta">
                <div>
                  <span>HORARIO</span>
                  <strong>12:00 a 22:30</strong>
                </div>

                <div>
                  <span>PARA COMPARTIR</span>
                  <strong>De 1 a 6 personas</strong>
                </div>
              </div>

              <div className="table-art" aria-hidden="true">
                <div className="table-outline">
                  <div className="plate">
                    <span>M.</span>
                  </div>

                  <div className="cutlery">║</div>
                  <div className="glass" />
                </div>

                <span className="art-caption">
                  Un lugar para los buenos momentos.
                </span>
              </div>
            </aside>

            {/* CONFIRMACIÓN O FORMULARIO */}
            {confirmed ? (
              <section
                className="booking-card success"
                aria-live="polite"
              >
                <span
                  className="success-icon"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span className="eyebrow">
                  TODO ESTÁ LISTO
                </span>

                <h2>Tu mesa está confirmada</h2>

                <p>
                  Te esperamos, {confirmed.name}.
                </p>

                <div className="review">
                  <div>
                    <span>Fecha</span>
                    <strong>
                      {displayDate(confirmed.date)}
                    </strong>
                  </div>

                  <div>
                    <span>Hora de Lima</span>
                    <strong>{confirmed.time}</strong>
                  </div>

                  <div>
                    <span>Reserva</span>
                    <strong>
                      {confirmed.guests} personas · Mesa{' '}
                      {confirmed.tableId}
                    </strong>
                  </div>

                  <div>
                    <span>Código</span>
                    <strong>
                      {confirmed.id.slice(0, 8).toUpperCase()}
                    </strong>
                  </div>
                </div>

                <p className="hint">
                  Guarda tu código. Esta demo confirma en pantalla;
                  no envía correos.
                </p>

                <button
                  className="primary full"
                  onClick={() => navigate('mine')}
                >
                  Ver mis reservas →
                </button>

                <button
                  className="text-button"
                  onClick={() => navigate('reserve')}
                >
                  Hacer otra reserva
                </button>
              </section>

            ) : (
              <ReservationForm
                key={editing?.id || 'new'}
                records={records}
                now={now}
                save={save}
                initial={editing}
                onClose={
                  editing
                    ? () => {
                        setEditing(null);
                        setView('mine');
                      }
                    : undefined
                }
                onDone={(r) => {
                  setConfirmed(r);
                  setEditing(null);
                  setView('reserve');
                }}
              />
            )}
          </div>

        ) : (

          /* MIS RESERVAS Y ADMINISTRACIÓN */
          <div
            className={
              view === 'admin'
                ? 'admin-layout'
                : ''
            }
          >
            {/* MENÚ LATERAL DEL ADMINISTRADOR */}
            {view === 'admin' && (
              <AdminSidebar
                activeSection={adminSection}
                onNavigate={setAdminSection}
                onLogout={() => {
                  setAdminSection('inicio');
                  navigate('home');
                }}
              />
            )}

           

{/* CONTENIDO DE ADMINISTRACIÓN / CLIENTE */}
<div className="management">

  <div className="management-intro">
    <div>
      <span className="eyebrow">
        MESANOVA /{' '}
        {view === 'admin'
          ? 'ADMINISTRACIÓN'
          : 'CLIENTE'}
      </span>

      {view === 'admin' ? (
        <>
          <h1>
            {adminSection === 'inicio'
              ? 'Panel de administración'
              : adminSection === 'reservas'
              ? 'Gestión de reservas'
              : 'Calendario de reservas'}
          </h1>

          <p className="admin-subtitle">
            {adminSection === 'inicio'
              ? 'Gestiona las reservas de tu restaurante.'
              : adminSection === 'reservas'
              ? 'Consulta, edita y administra las reservas.'
              : 'Visualiza las reservas por fecha.'}
          </p>
        </>
      ) : (
        <h1>Tus próximos encuentros.</h1>
      )}
    </div>

    <button
      className="primary"
      onClick={() => navigate('reserve')}
    >
      + Nueva reserva
    </button>
  </div>


              
              {/* ESTADÍSTICAS DEL ADMINISTRADOR */}
              {view === 'admin' && adminSection === 'inicio' && (
                <div className="stats admin-stats">

                  <div className="stat-card">
                    <span>Reservas hoy</span>
                    <strong>{todays.length}</strong>
                    <small>Reservas confirmadas para hoy</small>
                  </div>

                  <div className="stat-card">
                    <span>Pendientes</span>
                    <strong>{pending.length}</strong>
                    <small>Reservas por confirmar</small>
                  </div>

                  <div className="stat-card">
                    <span>Canceladas</span>
                    <strong>{cancelled.length}</strong>
                    <small>Total de reservas canceladas</small>
                  </div>

                  <div className="stat-card">
                    <span>Ocupación actual</span>
                    <strong>{occupancy}%</strong>
                    <small>
                      {occupiedTableIds.size} de{' '}
                      {TABLES.length} mesas ocupadas
                    </small>
                  </div>

                </div>
              )}

              
{/* DASHBOARD PRINCIPAL DEL ADMINISTRADOR */}
{view === 'admin' && adminSection === 'inicio' && (
  <AdminDashboard
    records={records}
    now={now}
    onViewReservations={() => setAdminSection('reservas')}
  />
)}


              {/* CALENDARIO DEL ADMINISTRADOR */}
              {view === 'admin' && adminSection === 'calendario' && (
                <AdminCalendar
                  records={records}
                  now={now}
                />
              )}

              {/* TABLA DEL ADMINISTRADOR / MIS RESERVAS */}
              {view === 'admin' ? (
                adminSection === 'reservas' && (
                  <AdminReservations
                    records={records}
                    now={now}
                    onEdit={setEditing}
                    onCancel={setCancelling}
                  />
                )
              ) : (
                <ReservationList
                  key={view}
                  records={records}
                  admin={false}
                  now={now}
                  onEdit={setEditing}
                  onCancel={setCancelling}
                />
              )}

            </div>
            {/* FIN DE MANAGEMENT */}

          </div>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="mesanova-footer">
        <div className="footer-content">
          <span className="footer-logo">
            MesaNova
          </span>

          <p>
            © 2026 MesaNova. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* CANCELACIÓN */}
      {cancelling && (
        <ConfirmDialog
          reservation={cancelling}
          onClose={() => setCancelling(null)}
          onConfirm={cancel}
        />
      )}
    </>
  );
}