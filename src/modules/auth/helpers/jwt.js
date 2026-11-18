// Claims que ASP.NET Core escribe con su URI completa.
const CLAIMS = {
  ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
};

const base64UrlDecode = (segment) => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

// Solo lee el payload para conocer exp/rol/email: la firma la valida el backend.
const decodeJwtPayload = (token) => {
  try {
    const [, payload] = String(token).split('.');

    return payload ? JSON.parse(base64UrlDecode(payload)) : null;
  } catch {
    return null;
  }
};

export { CLAIMS, decodeJwtPayload };
