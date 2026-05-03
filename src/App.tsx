import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProveedorModoTema } from "@/features/theme";
import { RutaProtegida } from "@/features/auth";
import { DashboardLayout } from "@/features/dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Payments from "./features/payments/views/Payments";
import Orders from "./features/orders/views/Orders";
import Reports from "./features/reports/views/Reports";
import Clients from "./features/clients/views/Clients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProveedorModoTema>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route
              element={
                <RutaProtegida>
                  <DashboardLayout />
                </RutaProtegida>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/clients" element={<Clients />} />
            </Route>

            {/* Ruta de error */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProveedorModoTema>
  </QueryClientProvider>
);

export default App;
