import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { BarraLateral } from "./Sidebar";
import { BarraSuperior } from "./Topbar";

export const DashboardLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <BarraLateral />

      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior />

        <main className="flex-1 space-y-6 p-4 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};