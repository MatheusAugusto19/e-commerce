import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import productSlice from './productSlice';
import cartSlice from './cartSlice';
import wishlistSlice from './wishlistSlice';
import authSlice from './authSlice';
import notificationSlice from './notificationSlice';
import reviewSlice from './reviewSlice';
import couponSlice from './couponSlice';
import freightSlice from './freightSlice';
import orderSlice from './orderSlice';

const useStore = create(
  persist(
    (set, get) => ({
      ...productSlice(set, get),
      ...cartSlice(set, get),
      ...wishlistSlice(set, get),
      ...authSlice(set, get),
      ...notificationSlice(set, get),
      ...reviewSlice(set, get),
      ...couponSlice(set, get),
      ...freightSlice(set, get),
      ...orderSlice(set, get),
    }),
    {
      name: 'ecommerce-storage', // Chave no localStorage
      storage: createJSONStorage(() => localStorage),
      // Salva apenas partes específicas do estado
      partialize: (state) => ({
        user: state.user,
        searchHistory: state.searchHistory,
        reviews: state.reviews,
        // Não persistir o carrinho, ele será carregado da API
      }),
      // Re-hidratação customizada
      onRehydrateStorage: (state) => {
        return (error) => {
          if (error) {
            console.error("Erro ao re-hidratar a store:", error);
          } else {
            // Inicializar estados que dependem de dados da API ou outras inicializações
            state.initializeAuth();
            state.fetchCart();
            state.fetchWishlist();
            state.fetchOrders();
          }
        };
      },
    }
  )
);

// Pega o estado inicial da store para inicialização
const initialState = useStore.getState();
if (initialState.user) {
  initialState.initializeAuth();
}
initialState.fetchCart();
initialState.fetchWishlist();
initialState.fetchOrders();


export default useStore;
