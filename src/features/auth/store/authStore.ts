import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SesionAutenticacion } from "../authService";

type AuthState = {
  sesion: SesionAutenticacion | null;
  isHydrated: boolean;

  setSesion: (sesion: SesionAutenticacion | null) => void;
  clearSesion: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sesion: null,
      isHydrated: false,

      setSesion: (sesion) => set({ sesion }),
      clearSesion: () => set({ sesion: null }),
      setHydrated: (v) => set({ isHydrated: v }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);