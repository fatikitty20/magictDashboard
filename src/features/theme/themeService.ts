export type ModoTema = "light" | "dark";

const claveModoTema = "magict.themeMode";

const esModoTema = (valor: unknown): valor is ModoTema => valor === "light" || valor === "dark";

const obtenerModoTemaGuardado = (): ModoTema | null => {
  try {
    const valor = window.localStorage.getItem(claveModoTema);
    return esModoTema(valor) ? valor : null;
  } catch {
    return null;
  }
};

export const servicioTema = {
  obtenerModoTemaInicial(): ModoTema {
    if (typeof window === "undefined") {
      return "light";
    }

    return obtenerModoTemaGuardado() ?? "light";
  },

  aplicarModoTema(modoTema: ModoTema): void {
    document.documentElement.classList.toggle("dark", modoTema === "dark");
    document.documentElement.style.colorScheme = modoTema;

    try {
      window.localStorage.setItem(claveModoTema, modoTema);
    } catch {
      // La interfaz sigue funcionando aunque storage no este disponible.
    }
  },

  obtenerSiguienteModoTema(modoTema: ModoTema): ModoTema {
    return modoTema === "dark" ? "light" : "dark";
  },
};
