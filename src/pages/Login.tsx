import { type FormEvent, useEffect, useState } from "react";
import { ArrowRight, Lock, Mail, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "@/features/auth/useAuth";
import { claseBotonPrimario, claseTarjeta } from "@/features/dashboard/estilosDashboard";

const Login = () => {
  const navigate = useNavigate();
  const { iniciarSesion, estaAutenticado } = useAutenticacion();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);

  useEffect(() => {
    if (estaAutenticado) {
      navigate("/dashboard", { replace: true });
    }
  }, [estaAutenticado, navigate]);

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEstaCargando(true);
    setError(null);

    try {
      await iniciarSesion({ correo, contrasena });
      navigate("/dashboard", { replace: true });
    } catch (errorCapturado) {
      setError(errorCapturado instanceof Error ? errorCapturado.message : "No pudimos iniciar sesion");
      setEstaCargando(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">MagicTronic</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesion en tu panel</p>
        </div>

        <div className={claseTarjeta("base", "p-8 shadow-sm")}>
          <form onSubmit={manejarEnvio} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  placeholder="demo@magictronic.com"
                  className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={contrasena}
                  onChange={(event) => setContrasena(event.target.value)}
                  placeholder="demo1234"
                  className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={estaCargando}
              className={claseBotonPrimario("group h-12 w-full gap-2 rounded-lg font-semibold shadow-lg shadow-success/20 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60")}
            >
              {estaCargando ? "Ingresando..." : "Ingresar"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          2026 MagicTronic. Plataforma de e-commerce.
        </p>
      </div>
    </main>
  );
};

export default Login;
