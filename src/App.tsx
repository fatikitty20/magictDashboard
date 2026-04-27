import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RutaProtegida } from "@/features/auth/ProtectedRoute";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { ProveedorModoTema } from "@/features/theme/ThemeModeProvider";
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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProveedorModoTema>
  </QueryClientProvider>
);

export default App;
