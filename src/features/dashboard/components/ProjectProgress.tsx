import { progresoPagos } from "../data";
import { claseTarjeta } from "../estilosDashboard";

export const ProgresoPagos = () => {
  const radio = 70;
  const circunferencia = Math.PI * radio;
  const desplazamiento = circunferencia - (progresoPagos / 100) * circunferencia;

  return (
    <div className={claseTarjeta("base", "flex flex-col p-6")}>
      <h3 className="mb-2 text-base font-semibold text-foreground">Progreso de pagos</h3>
      <div className="flex flex-1 flex-col items-center justify-center">
        <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible" aria-hidden="true">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeLinecap="round"
            strokeWidth="14"
          />
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="hsl(var(--success))"
            strokeDasharray={circunferencia}
            strokeDashoffset={desplazamiento}
            strokeLinecap="round"
            strokeWidth="14"
            className="transition-all duration-700"
          />
        </svg>
        <p className="-mt-4 text-3xl font-bold text-foreground">{progresoPagos}%</p>
        <p className="text-xs text-muted-foreground">Procesados este mes</p>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" /> Aprobados
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-info" /> En curso
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary" /> Pendientes
        </span>
      </div>
    </div>
  );
};
