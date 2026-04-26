import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { claseBotonIcono } from "@/features/dashboard/estilosDashboard";
import { useModoTema } from "../useThemeMode";

export const BotonTema = () => {
  const { esModoOscuro, alternarModoTema } = useModoTema();
  const etiqueta = esModoOscuro ? "Cambiar a modo dia" : "Cambiar a modo noche";
  const Icono = esModoOscuro ? Sun : Moon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={etiqueta}
          onClick={alternarModoTema}
          className={claseBotonIcono("h-10 w-10 bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background")}
        >
          <Icono className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{etiqueta}</TooltipContent>
    </Tooltip>
  );
};
