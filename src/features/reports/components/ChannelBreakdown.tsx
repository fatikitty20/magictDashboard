import { RadioTower } from "lucide-react";
import { claseTarjeta } from "@/features/dashboard/estilosDashboard";
import type { ChannelReport } from "../types/report";

type ChannelBreakdownProps = {
  channels: ChannelReport[];
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
  notation: "compact",
});

export const ChannelBreakdown = ({ channels, selectedChannel, onSelectChannel }: ChannelBreakdownProps) => (
  <section className={claseTarjeta("base", "p-5")}>
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          <RadioTower className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Canales</h2>
          <p className="text-xs text-muted-foreground">Participacion por origen de venta</p>
        </div>
      </div>
    </div>

    <div className="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectChannel("all")}
        className={`h-9 rounded-lg px-3 text-xs font-medium transition ${
          selectedChannel === "all"
            ? "bg-dashboard-inverted text-dashboard-inverted-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        Todos
      </button>
      {channels.map((channel) => (
        <button
          key={channel.channel}
          type="button"
          onClick={() => onSelectChannel(channel.channel)}
          className={`h-9 rounded-lg px-3 text-xs font-medium transition ${
            selectedChannel === channel.channel
              ? "bg-dashboard-inverted text-dashboard-inverted-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {channel.channel}
        </button>
      ))}
    </div>

    <div className="space-y-4">
      {channels.map((channel) => (
        <article
          key={channel.channel}
          className={`rounded-lg border border-border p-4 transition ${
            selectedChannel === "all" || selectedChannel === channel.channel ? "bg-background" : "opacity-45"
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{channel.channel}</p>
              <p className="text-xs text-muted-foreground">
                {channel.orders} ordenes | {channel.conversionRate}% conversion
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">{currencyFormatter.format(channel.revenue)}</p>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-success" style={{ width: `${channel.share}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{channel.share}% del total</p>
        </article>
      ))}
    </div>
  </section>
);
