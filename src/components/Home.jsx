
export default function Home({ onReserve }) {
  const benefits = [
    {
      icon: '♜',
      title: 'Gastronomía de autor',
      description:
        'Descubre lugares ideales para disfrutar una experiencia gastronómica especial.',
    },
    {
      icon: '▣',
      title: 'Reservas fáciles y rápidas',
      description:
        'Elige tu mesa en pocos clics y asegura tu lugar sin complicaciones.',
    },
    {
      icon: '☆',
      title: 'Ambientes únicos',
      description:
        'Vive momentos inolvidables en espacios diseñados para cada ocasión.',
    },
    {
      icon: '♢',
      title: 'Tu seguridad primero',
      description:
        'Disfruta de una atención cuidadosa y un servicio pensado para ti.',
    },
  ];

  return (
    <div className="mesanova-home">
      <section className="home-hero">
        <div className="home-content">
          <h1>
            Tu próxima experiencia
            <span> comienza aquí</span>
          </h1>

          <p>
            Disfruta de una experiencia gastronómica única en
            un ambiente acogedor. Elige tu mesa y reserva tu
            próximo momento especial con nosotros.
          </p>

          <button
            className="primary"
            onClick={onReserve}
          >
            Reservar una mesa
          </button>
        </div>

        
<div className="home-image">
  <img
    src="/Restaurante.jpg"
    alt="Interior del restaurante MesaNova"
  />
</div>

      </section>

      <section className="home-benefits">
        <h2>¿Por qué elegir MesaNova?</h2>

        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <article
              className="benefit-card"
              key={benefit.title}
            >
              <span className="benefit-icon">
                {benefit.icon}
              </span>

              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
