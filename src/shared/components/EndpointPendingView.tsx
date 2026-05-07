import { Server } from "lucide-react";
import { claseTarjeta } from "@/shared/ui/estilosDashboard";

type EndpointPendingViewProps = {
  title: string;
  description: string;
};

export const EndpointPendingView = ({ title, description }: EndpointPendingViewProps) => (
  <section className={claseTarjeta("base", "p-6")}>
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Server className="h-5 w-5" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  </section>
);
