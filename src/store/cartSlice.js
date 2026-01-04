const API_URL = "http://localhost:5000/cart";

const cartSlice = (set, get) => ({
  cartItems: [],
  
  // Ações síncronas para manipular o estado local
  _setCart: (items) => set({ cartItems: items }),
  _addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
  _updateCartItem: (item) => set((state) => ({
    cartItems: state.cartItems.map((i) => (i.id === item.id ? item : i)),
  })),
  _removeFromCart: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter((i) => i.id !== itemId),
  })),
  _clearCart: () => set({ cartItems: [] }),

  // Ações assíncronas que interagem com a API e depois chamam as ações síncronas
  fetchCart: async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    get()._setCart(data);
  },

  addToCart: async (product) => {
    const existingItem = get().cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      const res = await fetch(`${API_URL}/${existingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      const data = await res.json();
      get()._updateCartItem(data);
    } else {
      const newItem = { ...product, quantity: 1 };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      get()._addToCart(data);
    }
  },

  removeFromCart: async (productId) => {
    await fetch(`${API_URL}/${productId}`, { method: "DELETE" });
    get()._removeFromCart(productId);
  },

  increaseQuantity: async (productId) => {
    const itemToUpdate = get().cartItems.find((item) => item.id === productId);
    if (!itemToUpdate) return;
    const updatedItem = { ...itemToUpdate, quantity: itemToUpdate.quantity + 1 };
    
    const res = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });
    const data = await res.json();
    get()._updateCartItem(data);
  },

  decreaseQuantity: async (productId) => {
    const itemToUpdate = get().cartItems.find((item) => item.id === productId);
    if (itemToUpdate && itemToUpdate.quantity > 1) {
      const updatedItem = { ...itemToUpdate, quantity: itemToUpdate.quantity - 1 };
      const res = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      const data = await res.json();
      get()._updateCartItem(data);
    }
  },

  clearCart: async () => {
    const promises = get().cartItems.map(item => fetch(`${API_URL}/${item.id}`, { method: "DELETE" }));
    await Promise.all(promises);
    get()._clearCart();
  },

  // Funções de `get`
  getTotal: () => {
    return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getTotalItems: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

export default cartSlice;
