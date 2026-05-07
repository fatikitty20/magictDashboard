import { EndpointPendingView } from "@/shared/components/EndpointPendingView";

const Orders = () => (
  <EndpointPendingView
    title="Pedidos"
    description="La carpeta se conserva para la vista de pedidos, pero no muestra datos hasta que exista un endpoint real autorizado por backend."
  />
);

export default Orders;
