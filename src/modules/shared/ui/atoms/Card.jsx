// Si className ya define un padding base (p-0, p-6...), no se agrega p-5:
// con Tailwind, dos clases p-* en el mismo elemento no se pisan por orden.
const HAS_BASE_PADDING = /(^|\s)p-\d/;

// "as" permite renderizar la tarjeta como <article>, <section>, etc.
// El resto de las props (aria-*, id, onClick...) llega al elemento nativo,
// así Card se puede usar como cualquier contenedor HTML (OCP/LSP).
function Card({ as = 'div', children, className = '', ...restProps }) {
  const Component = as;
  const padding = HAS_BASE_PADDING.test(className) ? '' : 'p-5';

  return (
    <Component
      {...restProps}
      className={`bg-med-card border border-med-border rounded-xl shadow-xs ${padding} ${className}`}
    >
      {children}
    </Component>
  );
}

export default Card;
