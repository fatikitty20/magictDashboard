import { Navigate } from "react-router-dom";
import { useAutenticacion } from "@/features/auth/useAuth";

const Index = () => {
  const { estaAutenticado } = useAutenticacion();

  return <Navigate to={estaAutenticado ? "/dashboard" : "/login"} replace />;
};

export default Index;
