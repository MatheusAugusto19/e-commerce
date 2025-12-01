import React, { useState, useEffect, createContext } from "react";

const API_URL = "http://localhost:5000/orders";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const addOrder = (orderData) => {
    const newOrder = {
      id: "PED-" + Date.now(),
      ...orderData,
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR"),
      status: "Processando",
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders((prev) => [data, ...prev]);
      });
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    const updatedOrder = { ...orderToUpdate, status };

    fetch(`${API_URL}/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data : order))
        );
      });
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
