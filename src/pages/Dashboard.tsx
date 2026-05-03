import { Plus, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GraficoAnaliticas } from "@/features/dashboard/components/AnalyticsChart";
import { ColaboracionEquipo } from "@/features/dashboard/components/TeamCollaboration";
import { ControlTiempo } from "@/features/dashboard/components/TimeTracker";
import { ListaProyectos } from "@/features/dashboard/components/ProjectsList";
import { ProgresoPagos } from "@/features/dashboard/components/ProjectProgress";
import { TarjetaMetrica } from "@/features/dashboard/components/MetricCard";
import { TarjetaRecordatorio } from "@/features/dashboard/components/ReminderCard";
import { useDashboard } from "@/features/dashboard";
import { obtenerDatosDashboard, type LlaveTraduccion } from "@/features/dashboard/data";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import type { DashboardWidget } from "@/features/dashboard/config/dashboardConfig";

const PanelDashboard = () => {
  const { t } = useTranslation();
  const dashboardConfig = useDashboard();
  const datosDashboard = obtenerDatosDashboard(dashboardConfig.role);
  const tipoRol = dashboardConfig.role === "admin" ? "admin" : "client";
  const titleKey: LlaveTraduccion = tipoRol === "admin" ? "dashboard.admin.title" : "dashboard.client.title";
  const descriptionKey: LlaveTraduccion =
    tipoRol === "admin" ? "dashboard.admin.description" : "dashboard.client.description";

  const tieneWidget = (widget: DashboardWidget) => dashboardConfig.widgets.includes(widget);

  return (
    <div className="space-y-6">
      {tieneWidget("metrics") ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-foreground">{t(titleKey)}</h1>
              <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
                <Plus className="h-4 w-4" /> {t(datosDashboard.textos.primaryActionKey)}
              </button>
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
              >
                <Upload className="h-4 w-4" /> {t(datosDashboard.textos.secondaryActionKey)}
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {datosDashboard.metricas.map((metrica) => (
              <TarjetaMetrica key={metrica.id} {...metrica} />
            ))}
          </section>
        </>
      ) : null}

      {tieneWidget("analytics") || tieneWidget("projects") ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tieneWidget("analytics") ? (
            <div className={tieneWidget("projects") ? "lg:col-span-2" : "lg:col-span-3"}>
              <GraficoAnaliticas barras={datosDashboard.barrasAnaliticas} titleKey={datosDashboard.textos.analyticsTitleKey} />
            </div>
          ) : null}
          {tieneWidget("projects") ? (
            <ListaProyectos
              proyectosListado={datosDashboard.proyectos}
              titleKey={datosDashboard.textos.projectsTitleKey}
              actionKey={datosDashboard.textos.projectsNewKey}
            />
          ) : null}
        </section>
      ) : null}

      {tieneWidget("team") || tieneWidget("progress") || tieneWidget("reminder") ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tieneWidget("team") ? (
            <ColaboracionEquipo
              miembros={datosDashboard.miembrosEquipo}
              titleKey={datosDashboard.textos.teamTitleKey}
              actionKey={datosDashboard.textos.teamInviteKey}
            />
          ) : null}
          {tieneWidget("progress") ? (
            <ProgresoPagos
              progreso={datosDashboard.progresoPagos}
              titleKey={datosDashboard.textos.progressTitleKey}
              subtitleKey={datosDashboard.textos.progressSubtitleKey}
            />
          ) : null}
          {tieneWidget("reminder") ? (
            <TarjetaRecordatorio
              recordatorioActual={datosDashboard.recordatorio}
              sectionTitleKey={datosDashboard.textos.reminderSectionTitleKey}
              actionKey={datosDashboard.textos.reminderActionKey}
            />
          ) : null}
        </section>
      ) : null}

      {tieneWidget("time") ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ControlTiempo tiempo={datosDashboard.tiempoSesion} titleKey={datosDashboard.textos.timerTitleKey} />
        </section>
      ) : null}
    </div>
  );
};

export default PanelDashboard;
