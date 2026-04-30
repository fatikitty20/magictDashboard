import { type HTMLAttributes } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

type SelectorIdiomaProps = HTMLAttributes<HTMLDivElement>;

type CodigoIdioma = "en" | "es";

const opcionesIdioma = [
  { codigo: "en", etiqueta: "EN" },
  { codigo: "es", etiqueta: "ES" },
] as const;

export const SelectorIdioma = ({ className = "", ...props }: SelectorIdiomaProps) => {
  const { i18n, t } = useTranslation();

  const cambiarIdioma = async (codigoIdioma: CodigoIdioma) => {
    await i18n.changeLanguage(codigoIdioma);
    try {
      window.localStorage.setItem("magictronic.i18nextLng", codigoIdioma);
    } catch {
      // La selección sigue funcionando aunque el storage no esté disponible.
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()} {...props}>
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {t("language.label")}
      </span>
      <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-sm">
        {opcionesIdioma.map((opcion) => {
          const activo = i18n.resolvedLanguage?.startsWith(opcion.codigo) === true;

          return (
            <button
              key={opcion.codigo}
              type="button"
              onClick={() => void cambiarIdioma(opcion.codigo)}
              aria-pressed={activo}
              className={
                activo
                  ? "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition"
                  : "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
              }
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>
    </div>
  );
};