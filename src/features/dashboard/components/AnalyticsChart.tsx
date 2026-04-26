import { barrasAnaliticas } from "../data";
import { claseBarraAnalitica, claseTarjeta } from "../estilosDashboard";

export const GraficoAnaliticas = () => (
  <div className={claseTarjeta("base", "p-6")}>
    <h3 className="mb-6 text-lg font-semibold text-foreground">Project Analytics</h3>

    <div className="flex h-44 items-end justify-between gap-3">
      {barrasAnaliticas.map((barra, indice) => (
        <div
          key={barra.dia}
          className={claseBarraAnalitica(barra.tono, "relative flex-1 origin-bottom rounded-full animate-grow-bar")}
          style={{ height: `${barra.valor}%`, animationDelay: `${indice * 60}ms` }}
        >
          {barra.activa ? (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
              {barra.valor}%
            </span>
          ) : null}
        </div>
      ))}
    </div>

    <div className="mt-3 flex justify-between gap-3">
      {barrasAnaliticas.map((barra) => (
        <span
          key={barra.dia}
          className={`flex-1 text-center text-[11px] font-medium ${
            barra.activa ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {barra.dia}
        </span>
      ))}
    </div>
  </div>
);
