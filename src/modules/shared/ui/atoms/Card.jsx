// Si className ya define un padding base (p-0, p-6...), no se agrega p-5:
// con Tailwind, dos clases p-* en el mismo elemento no se pisan por orden.
const HAS_BASE_PADDING = /(^|\s)p-\d/;

// "as" permite renderizar la tarjeta como <article>, <section>, etc.
function Card({ as = 'div', children, className = '' }) {
  const Component = as;
  const padding = HAS_BASE_PADDING.test(className) ? '' : 'p-5';

  return (
    <Component
      className={`bg-med-card border border-med-border rounded-xl shadow-xs ${padding} ${className}`}
    >
      {children}
    </Component>
  );
}

export default Card;
