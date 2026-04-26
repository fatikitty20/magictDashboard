import { Navigate } from "react-router-dom";
import { servicioAutenticacion } from "@/features/auth/authService";

const Index = () => (
  <Navigate to={servicioAutenticacion.estaAutenticado() ? "/dashboard" : "/login"} replace />
);

export default Index;
