import React, { useState, useEffect } from "react";
import { OrderContext } from "./createOrderContext";

const ORDERS_STORAGE_KEY = "ecommerce_orders";

// Função para carregar pedidos do localStorage
const loadOrdersFromStorage = () => {
  const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (savedOrders) {
    try {
      return JSON.parse(savedOrders);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      return [];
    }
  }
  return [];
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => loadOrdersFromStorage());

  // Salvar pedidos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: "PED-" + Date.now(),
      ...orderData,
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR"),
      status: "Processando",
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
