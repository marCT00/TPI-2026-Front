import { instance } from '../../shared/api/axiosInstance';

const toLoginResponse = (data) => ({
  token: data?.token ?? data?.Token,
  role: data?.role ?? data?.Role,
});

// POST /api/auth/admin/login → { token, role }
const loginAdmin = async ({ email, password }) => {
  const { data } = await instance.post('api/auth/admin/login', {
    email: email.trim(),
    password,
  });

  return toLoginResponse(data);
};

// POST /api/auth/patient/login → { token, role }
// Si el paciente no existe, el backend lo crea automáticamente.
const loginPatient = async ({ email, dni }) => {
  const { data } = await instance.post('api/auth/patient/login', {
    email: email.trim(),
    dni: String(dni).trim(),
  });

  return toLoginResponse(data);
};

export { loginAdmin, loginPatient };
