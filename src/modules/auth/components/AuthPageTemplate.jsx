import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '../../shared/ui/atoms/icons';

// Template (Atomic Design) compartido por los logins de Administrador y Paciente.
function AuthPageTemplate({
  title,
  subtitle,
  children,
  aside = null,
  switchLink,
}) {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <header className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <ShieldCheckIcon className="w-8 h-8 text-med-primary-900" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </header>

      <section
        aria-labelledby="auth-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="p-6 sm:p-10">
          <header className="mb-6">
            <h2
              id="auth-title"
              className="text-xl font-bold text-med-primary-900"
            >
              {title}
            </h2>
            <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
              {subtitle}
            </p>
          </header>
          {children}
        </div>
        {aside}
      </section>

      {switchLink && (
        <nav className="mt-6 text-center" aria-label="Cambiar de portal">
          <Link
            to={switchLink.to}
            className="text-xs text-med-primary-200 hover:text-white transition"
          >
            {switchLink.label}
          </Link>
        </nav>
      )}
    </main>
  );
}

export default AuthPageTemplate;
