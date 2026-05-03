import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";

const Index = () => {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return null; // o loader
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default Index;