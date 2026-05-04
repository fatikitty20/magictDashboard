import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";

const IndexPage = () => {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          <span className="text-sm">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default IndexPage;