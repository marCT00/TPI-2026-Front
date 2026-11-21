import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import ToastProvider from './modules/shared/ui/organisms/toast/ToastProvider';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import GuestRoute from './modules/auth/components/GuestRoute';
import { ROLES } from './modules/auth/helpers/roles';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';

// Patients Module
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import DoctorFormPage from './modules/doctors/pages/DoctorFormPage';
import SpecialitiesPage from './modules/specialities/pages/SpecialitiesPage';
import SpecialityFormPage from './modules/specialities/pages/SpecialityFormPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';

const routes = [
  // Rutas públicas
  {
    path: '/login',
    element: (
      <GuestRoute>
        <PatientLoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <GuestRoute>
        <AdminLoginPage />
      </GuestRoute>
    ),
  },

  // Rutas privadas de pacientes (URL base y turnos)
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.PATIENT]} redirectTo="/login">
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
    ],
  },

  // Rutas privadas de gestión clínica y administración
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]} redirectTo="/admin/login">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/home" replace />,
      },
      {
        path: 'home',
        element: <OverviewPage />,
      },
      {
        path: 'patients',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'patient-search',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'appointments',
        element: <Navigate to="/admin/patients" replace />,
      },
      {
        path: 'specialities',
        element: <SpecialitiesPage />,
      },
      {
        path: 'specialities/new',
        element: <SpecialityFormPage />,
      },
      {
        path: 'specialities/:id/edit',
        element: <SpecialityFormPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
      {
        path: 'doctors/new',
        element: <DoctorFormPage />,
      },
    ],
  },

  // Redirección para cualquier otra URL
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

// Se crea una sola vez (fuera del componente) para no reconstruir el router
// en cada render.
const router = createBrowserRouter(routes);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
