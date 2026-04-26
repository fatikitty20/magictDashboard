import { beforeEach, describe, expect, it } from "vitest";
import { servicioAutenticacion } from "./authService";

describe("servicioAutenticacion", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("crea una sesion mock sin guardar la contrasena", async () => {
    const sesion = await servicioAutenticacion.iniciarSesion({
      correo: " Demo@Tiendanube.com ",
      contrasena: " demo1234 ",
    });
    const sesionGuardada = window.localStorage.getItem("tiendanube.auth.session");

    expect(sesion.correo).toBe("demo@tiendanube.com");
    expect(sesion.proveedor).toBe("mock");
    expect(sesionGuardada).not.toContain("demo1234");
    expect(servicioAutenticacion.estaAutenticado()).toBe(true);
  });

  it("rechaza correos invalidos", async () => {
    await expect(servicioAutenticacion.iniciarSesion({ correo: "demo", contrasena: "demo1234" })).rejects.toThrow(
      "email valido",
    );
  });

  it("limpia sesiones vencidas", () => {
    window.localStorage.setItem(
      "tiendanube.auth.session",
      JSON.stringify({
        correo: "demo@tiendanube.com",
        emitidaEn: Date.now() - 1000,
        expiraEn: Date.now() - 1,
        proveedor: "mock",
      }),
    );

    expect(servicioAutenticacion.obtenerSesion()).toBeNull();
    expect(window.localStorage.getItem("tiendanube.auth.session")).toBeNull();
  });
});
