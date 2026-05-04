import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { appRoutes, type RouteConfig } from "@/config/routes";
import { RutaProtegida } from "@/features/auth";
import { ProveedorModoTema } from "@/features/theme";

const renderRoute = (route: RouteConfig, index: number) => {
  const element = route.allowedRoles ? (
    <RutaProtegida allowedRoles={route.allowedRoles}>{route.element}</RutaProtegida>
  ) : (
    route.element
  );

  return (
    <Route key={`${route.path}-${index}`} path={route.path} element={element}>
      {route.children?.map(renderRoute)}
    </Route>
  );
};

const App = () => (
  <ProveedorModoTema>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>{appRoutes.map(renderRoute)}</Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ProveedorModoTema>
);

export default App;
