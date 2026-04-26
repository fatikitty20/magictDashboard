import { Plus } from "lucide-react";
import { proyectos } from "../data";
import { claseTarjeta, claseTonoSuave } from "../estilosDashboard";

export const ListaProyectos = () => (
  <div className={claseTarjeta("base", "p-6")}>
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-semibold text-foreground">Proyectos</h3>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <Plus className="h-3 w-3" /> Nuevo
      </button>
    </div>
    <ul className="space-y-4">
      {proyectos.map((proyecto) => (
        <li key={proyecto.id} className="flex items-start gap-3">
          <div className={claseTonoSuave(proyecto.tono, "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold")}>
            {proyecto.nombre.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{proyecto.nombre}</p>
            <p className="text-[11px] text-muted-foreground">Vence: {proyecto.vencimiento}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
