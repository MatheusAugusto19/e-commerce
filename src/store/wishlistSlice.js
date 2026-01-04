const API_URL = "http://localhost:5000/wishlist";

const wishlistSlice = (set, get) => ({
  wishlistItems: [],

  fetchWishlist: async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    set({ wishlistItems: data });
  },

  addToWishlist: async (product) => {
    const exists = get().wishlistItems.some((item) => item.id === product.id);
    if (!exists) {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      set((state) => ({ wishlistItems: [...state.wishlistItems, data] }));
    }
  },

  removeFromWishlist: async (productId) => {
    await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
    set((state) => ({
      wishlistItems: state.wishlistItems.filter((item) => item.id !== productId),
    }));
  },

  clearWishlist: async () => {
    const promises = get().wishlistItems.map(item => fetch(`${API_URL}/${item.id}`, { method: 'DELETE' }));
    await Promise.all(promises);
    set({ wishlistItems: [] });
  },

  isInWishlist: (productId) => {
    return get().wishlistItems.some((item) => item.id === productId);
  },

  getTotalWishlistItems: () => {
    return get().wishlistItems.length;
  },
});

export default wishlistSlice;
