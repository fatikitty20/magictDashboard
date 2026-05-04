import { apiClient } from "@/shared/api/apiClient";

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
  proveedor: "mock" | "api"; // 🔥 ahora soporta backend real
  usuario: UsuarioAutenticado;
}

export interface AdaptadorAutenticacion {
  iniciarSesion(credenciales: CredencialesAutenticacion): Promise<SesionAutenticacion>;
  cerrarSesion(): Promise<void>;
  obtenerSesion(): Promise<SesionAutenticacion | null>; // 🔥 async para backend
}

const USE_REAL_API = false; // 🔥 CAMBIAR A true cuando conectes backend

const duracionSesionMs = 8 * 60 * 60 * 1000;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let sesionActual: SesionAutenticacion | null = null;

const resolverRolUsuario = (correo: string): RolUsuario =>
  correo.includes("admin") ? "admin" : "client";

const normalizarCredenciales = ({
  correo,
  contrasena,
}: CredencialesAutenticacion): CredencialesAutenticacion => ({
  correo: correo.trim().toLowerCase(),
  contrasena: contrasena.trim(),
});

const limpiarSesionSegura = (): void => {
  sesionActual = null;
};

const guardarSesionSegura = (sesion: SesionAutenticacion): void => {
  sesionActual = sesion;
};

const obtenerSesionSegura = (): SesionAutenticacion | null => {
  if (!sesionActual) {
    return null;
  }

  if (Date.now() > sesionActual.expiraEn) {
    limpiarSesionSegura();
    return null;
  }

  return sesionActual;
};


// ================= MOCK =================

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

  async obtenerSesion() {
    return obtenerSesionSegura();
  },
};



// ================= API REAL (PREPARADO) =================

const adaptadorAutenticacionApi: AdaptadorAutenticacion = {
  async iniciarSesion(credenciales) {
    await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(credenciales),
    });

    // 🔥 backend guarda cookie httpOnly
    return this.obtenerSesion() as Promise<SesionAutenticacion>;
  },

  async cerrarSesion() {
    await apiClient("/auth/logout", {
      method: "POST",
    });
  },

  async obtenerSesion() {
    try {
      return await apiClient<SesionAutenticacion>("/auth/me");
    } catch {
      return null;
    }
  },
};



// ================= SELECTOR =================

const adaptadorAutenticacionActivo: AdaptadorAutenticacion =
  USE_REAL_API ? adaptadorAutenticacionApi : adaptadorAutenticacionMock;



// ================= API PUBLICA =================

export const servicioAutenticacion = {
  iniciarSesion(credenciales: CredencialesAutenticacion) {
    return adaptadorAutenticacionActivo.iniciarSesion(credenciales);
  },

  cerrarSesion() {
    return adaptadorAutenticacionActivo.cerrarSesion();
  },

  obtenerSesion() {
    return adaptadorAutenticacionActivo.obtenerSesion();
  },

  async estaAutenticado() {
    const sesion = await adaptadorAutenticacionActivo.obtenerSesion();
    return sesion !== null;
  },
};
