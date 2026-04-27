import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RutaProtegida } from "@/features/auth/ProtectedRoute";
import { ProveedorModoTema } from "@/features/theme/ThemeModeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Payments from "./features/payments/views/Payments";
import Orders from "./features/orders/views/Orders";

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
              path="/dashboard"
              element={
                <RutaProtegida>
                  <Dashboard />
                </RutaProtegida>
              }
            />
            <Route
              path="/payments"
              element={
                <RutaProtegida>
                  <Payments />
                </RutaProtegida>
              }
            />
            <Route
              path="/orders"
              element={
                <RutaProtegida>
                  <Orders />
                </RutaProtegida>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProveedorModoTema>
  </QueryClientProvider>
);

export default App;
