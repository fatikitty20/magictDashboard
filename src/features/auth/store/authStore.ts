import { create } from "zustand";
import type { SesionAutenticacion } from "../authService";

type AuthState = {
  sesion: SesionAutenticacion | null;
  isHydrated: boolean;

  setSesion: (sesion: SesionAutenticacion | null) => void;
  clearSesion: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  sesion: null,

  // La sesion mock vive solo en memoria.
  // Asi evitamos guardar roles editables en localStorage.
  isHydrated: true,

  setSesion: (sesion) => set({ sesion }),
  clearSesion: () => set({ sesion: null }),
  setHydrated: (v) => set({ isHydrated: v }),
}));
