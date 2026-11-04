
export default function AdminSidebar({
  activeSection,
  onNavigate,
  onLogout
}) {
  const sections = [
    { id: 'inicio', label: 'Inicio', icon: '⌂' },
    { id: 'reservas', label: 'Reservas', icon: '▤' },
    { id: 'calendario', label: 'Calendario', icon: '▦' }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        MesaNova
      </div>

      <nav
        className="admin-sidebar-nav"
        aria-label="Navegación del administrador"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={
              activeSection === section.id
                ? 'admin-sidebar-link is-active'
                : 'admin-sidebar-link'
            }
            aria-current={
              activeSection === section.id
                ? 'page'
                : undefined
            }
            onClick={() => onNavigate(section.id)}
          >
            <span aria-hidden="true">
              {section.icon}
            </span>
            {section.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="admin-sidebar-logout"
        onClick={onLogout}
      >
        <span aria-hidden="true">↪</span>
        Cerrar sesión
      </button>
    </aside>
  );
}
