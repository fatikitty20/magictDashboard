import { Plus, Upload } from "lucide-react";
import { GraficoAnaliticas } from "@/features/dashboard/components/AnalyticsChart";
import { ColaboracionEquipo } from "@/features/dashboard/components/TeamCollaboration";
import { ControlTiempo } from "@/features/dashboard/components/TimeTracker";
import { ListaProyectos } from "@/features/dashboard/components/ProjectsList";
import { ProgresoPagos } from "@/features/dashboard/components/ProjectProgress";
import { TarjetaMetrica } from "@/features/dashboard/components/MetricCard";
import { TarjetaRecordatorio } from "@/features/dashboard/components/ReminderCard";
import { metricasProyecto } from "@/features/dashboard/data";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";

const PanelDashboard = () => (
  <>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-1 text-3xl font-bold text-foreground">Panel de control</h1>
        <p className="text-sm text-muted-foreground">Gestiona tus pagos, pedidos y el rendimiento de tu tienda.</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
          <Plus className="h-4 w-4" /> Nuevo cobro
        </button>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
        >
          <Upload className="h-4 w-4" /> Exportar
        </button>
      </div>
    </div>

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricasProyecto.map((metrica) => (
        <TarjetaMetrica key={metrica.id} {...metrica} />
      ))}
    </section>

    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <GraficoAnaliticas />
      <TarjetaRecordatorio />
      <ListaProyectos />
    </section>

    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ColaboracionEquipo />
      <ProgresoPagos />
      <ControlTiempo />
    </section>
  </>
);

export default PanelDashboard;
