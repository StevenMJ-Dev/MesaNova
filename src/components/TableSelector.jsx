
import { TABLES, availableTables } from '../lib/reservations';

export default function TableSelector({
  records,
  date,
  time,
  guests,
  selectedTable,
  onSelect,
  ignoreId,
  now
}) {
  const available = availableTables(
    records,
    date,
    time,
    guests,
    ignoreId,
    now
  );

  const availableIds = new Set(
    available.map((table) => table.id)
  );

  return (
    <section className="table-selector">
      <div className="table-selector-heading">
        <h3>Elige tu mesa</h3>
        <p>
          Selecciona una mesa disponible para disfrutar
          tu experiencia en MesaNova.
        </p>
      </div>

      <div className="table-legend">
        <span>
          <i className="legend-dot available" />
          Disponible
        </span>

        <span>
          <i className="legend-dot occupied" />
          No disponible
        </span>

        <span>
          <i className="legend-dot chosen" />
          Seleccionada
        </span>
      </div>

      <div className="tables-grid">
        {TABLES.map((table) => {
          const isAvailable = availableIds.has(table.id);
          const isSelected =
            selectedTable === table.id;

          return (
            <button
              key={table.id}
              type="button"
              disabled={!isAvailable}
              className={`table-option ${
                isSelected ? 'is-selected' : ''
              } ${!isAvailable ? 'is-occupied' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(table.id)}
            >
              <span
                className="table-option-icon"
                aria-hidden="true"
              >
                ♧
              </span>

              <strong>
                Mesa {table.id.replace('M', '')}
              </strong>

              <span className="table-capacity">
                {table.seats} personas
              </span>

              <span className="table-status">
                {isSelected
                  ? 'Seleccionada'
                  : isAvailable
                    ? 'Disponible'
                    : 'No disponible'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
