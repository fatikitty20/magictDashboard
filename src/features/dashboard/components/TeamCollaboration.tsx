import { Plus } from "lucide-react";
import { miembrosEquipo } from "../data";
import { claseAvatarTono, claseTarjeta, claseTonoSuave } from "../estilosDashboard";

export const ColaboracionEquipo = () => (
  <div className={claseTarjeta("base", "p-6")}>
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-semibold text-foreground">Equipo PSP</h3>
      <button
        type="button"
        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground transition hover:bg-muted"
      >
        <Plus className="h-3 w-3" /> Invitar
      </button>
    </div>
    <ul className="space-y-4">
      {miembrosEquipo.map((miembro) => (
        <li key={miembro.id} className="flex items-center gap-3">
          <div className={claseAvatarTono(miembro.tono, "h-9 w-9 rounded-full")} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{miembro.nombre}</p>
            <p className="truncate text-[11px] text-muted-foreground">{miembro.tarea}</p>
          </div>
          <span className={claseTonoSuave(miembro.tono, "rounded-full px-2 py-1 text-[10px] font-medium")}>
            {miembro.estado}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
