export interface CredencialesAutenticacion {
  correo: string;
  contrasena: string;
}

export type RolUsuario = "admin" | "client";

export interface UsuarioAutenticado {
  correo: string;
  role: RolUsuario;
}

export interface SesionAutenticacion {
  correo: string;
  emitidaEn: number;
  expiraEn: number;
  proveedor: "mock";
  usuario: UsuarioAutenticado;
}

export interface AdaptadorAutenticacion {
  iniciarSesion(credenciales: CredencialesAutenticacion): Promise<SesionAutenticacion>;
  cerrarSesion(): Promise<void>;
  obtenerSesion(): SesionAutenticacion | null;
}

const duracionSesionMs = 8 * 60 * 60 * 1000;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let sesionActual: SesionAutenticacion | null = null;

const resolverRolUsuario = (correo: string): RolUsuario => (correo.includes("admin") ? "admin" : "client");

const esSesionAutenticacion = (valor: unknown): valor is SesionAutenticacion => {
  if (!valor || typeof valor !== "object") {
    return false;
  }

  const sesion = valor as Partial<SesionAutenticacion>;

  return (
    typeof sesion.correo === "string" &&
    typeof sesion.emitidaEn === "number" &&
    typeof sesion.expiraEn === "number" &&
    sesion.proveedor === "mock" &&
    typeof sesion.usuario === "object" &&
    sesion.usuario !== null &&
    typeof (sesion.usuario as UsuarioAutenticado).correo === "string" &&
    ((sesion.usuario as UsuarioAutenticado).role === "admin" || (sesion.usuario as UsuarioAutenticado).role === "client")
  );
};

const normalizarCredenciales = ({ correo, contrasena }: CredencialesAutenticacion): CredencialesAutenticacion => ({
  correo: correo.trim().toLowerCase(),
  contrasena: contrasena.trim(),
});

const limpiarSesionSegura = (): void => {
  sesionActual = null;
};

const guardarSesionSegura = (sesion: SesionAutenticacion): void => {
  sesionActual = sesion;
};

const adaptadorAutenticacionMock: AdaptadorAutenticacion = {
  async iniciarSesion(credenciales) {
    const credencialesNormalizadas = normalizarCredenciales(credenciales);

    if (!patronCorreo.test(credencialesNormalizadas.correo)) {
      throw new Error("Ingresa un email valido");
    }

    if (!credencialesNormalizadas.contrasena) {
      throw new Error("Ingresa tu contrasena");
    }

    const emitidaEn = Date.now();
    const role = resolverRolUsuario(credencialesNormalizadas.correo);
    const sesion: SesionAutenticacion = {
      correo: credencialesNormalizadas.correo,
      emitidaEn,
      expiraEn: emitidaEn + duracionSesionMs,
      proveedor: "mock",
      usuario: {
        correo: credencialesNormalizadas.correo,
        role,
      },
    };

    guardarSesionSegura(sesion);
    return sesion;
  },

  async cerrarSesion() {
    limpiarSesionSegura();
  },

  obtenerSesion() {
    if (!sesionActual || !esSesionAutenticacion(sesionActual) || sesionActual.expiraEn <= Date.now()) {
      limpiarSesionSegura();
      return null;
    }

    return sesionActual;
  },
};

const adaptadorAutenticacionActivo = adaptadorAutenticacionMock;

export const servicioAutenticacion = {
  iniciarSesion(credenciales: CredencialesAutenticacion): Promise<SesionAutenticacion> {
    return adaptadorAutenticacionActivo.iniciarSesion(credenciales);
  },

  cerrarSesion(): Promise<void> {
    return adaptadorAutenticacionActivo.cerrarSesion();
  },

  obtenerSesion(): SesionAutenticacion | null {
    return adaptadorAutenticacionActivo.obtenerSesion();
  },

  estaAutenticado(): boolean {
    return adaptadorAutenticacionActivo.obtenerSesion() !== null;
  },
};
