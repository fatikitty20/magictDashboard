import { Link } from "react-router-dom";
import { claseTarjeta } from "@/features/dashboard/estilosDashboard";

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className={claseTarjeta("base", "max-w-md p-8 text-center")}>
      <h1 className="mb-3 text-4xl font-bold text-foreground">404</h1>
      <p className="mb-5 text-sm text-muted-foreground">La ruta que buscabas no existe.</p>
      <Link to="/" className="text-sm font-medium text-info underline-offset-4 hover:underline">
        Volver al inicio
      </Link>
    </div>
  </main>
);

export default NotFound;
