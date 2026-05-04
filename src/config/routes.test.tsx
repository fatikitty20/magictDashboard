import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRoutes } from "./routes";
import { RutaProtegida } from "../features/auth";
import { ROLES } from "../features/auth/roles";

const mockUseAuth = vi.fn();

vi.mock("../features/auth/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const UbicacionActual = () => {
  const location = useLocation();

  return <span data-testid="ruta-actual">{location.pathname}</span>;
};

describe("appRoutes", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("centraliza el layout protegido y los roles por ruta", () => {
    const raizProtegida = appRoutes.find((route) => route.path === "/" && route.children);

    expect(raizProtegida?.requiresAuth).toBe(true);
    expect(raizProtegida?.children).toHaveLength(6);

    const transacciones = raizProtegida?.children?.find((route) => route.path === "transactions");

    expect(transacciones?.requiresAuth).toBe(true);
    expect(transacciones?.allowedRoles).toEqual([ROLES.ADMIN]);
  });

  it("redirige a login cuando no hay sesion", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isHydrated: true,
      isCheckingAuth: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<UbicacionActual />} />
          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <div>Dashboard</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/login");
  });

  it("bloquea accesso a transactions para roles no admin", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: ROLES.CLIENT },
      isHydrated: true,
      isCheckingAuth: false,
    });

    render(
      <MemoryRouter initialEntries={["/transactions"]}>
        <Routes>
          <Route path="/dashboard" element={<UbicacionActual />} />
          <Route
            path="/transactions"
            element={
              <RutaProtegida allowedRoles={[ROLES.ADMIN]}>
                <div>Transacciones</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/dashboard");
  });
});
