const API_URL = "http://localhost:5000/orders";

const orderSlice = (set, get) => ({
  orders: [],

  fetchOrders: async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    set({ orders: data });
  },

  addOrder: async (orderData) => {
    const newOrder = {
      id: "PED-" + Date.now(),
      ...orderData,
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR"),
      status: "Processando",
    };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });
    const data = await res.json();
    set((state) => ({ orders: [data, ...state.orders] }));
    return newOrder;
  },

  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },
});

export default orderSlice;
