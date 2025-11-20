import { useContext } from "react";
import { OrderContext } from "./createOrderContext";

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder deve ser usado dentro de OrderProvider");
  }
  return context;
}
