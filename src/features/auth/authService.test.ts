import { beforeEach, describe, expect, it, vi } from "vitest";
import { servicioAutenticacion } from "./authService";

describe("servicioAutenticacion", () => {
  beforeEach(() => {
    servicioAutenticacion.cerrarSesion();
    window.localStorage.clear();
  });

  it("crea una sesion mock persistida", async () => {
    const sesion = await servicioAutenticacion.iniciarSesion({
      correo: " Demo@Magictronic.com ",
      contrasena: " demo1234 ",
    });

    expect(sesion.correo).toBe("demo@magictronic.com");
    expect(sesion.proveedor).toBe("mock");
    expect(window.localStorage.getItem("__auth_session")).not.toBeNull();
    expect(servicioAutenticacion.estaAutenticado()).toBe(true);
  });

  it("rechaza correos invalidos", async () => {
    await expect(servicioAutenticacion.iniciarSesion({ correo: "demo", contrasena: "demo1234" })).rejects.toThrow(
      "email valido",
    );
  });

  it("expira la sesion al pasar el tiempo configurado", async () => {
    const base = Date.now();
    const mockDateNow = vi.spyOn(Date, "now");

    mockDateNow.mockReturnValue(base);
    await servicioAutenticacion.iniciarSesion({ correo: "demo@Magictronic.com", contrasena: "demo1234" });

    mockDateNow.mockReturnValue(base + 8 * 60 * 60 * 1000 + 1);

    expect(servicioAutenticacion.obtenerSesion()).toBeNull();
    expect(servicioAutenticacion.estaAutenticado()).toBe(false);

    mockDateNow.mockRestore();
  });
});

