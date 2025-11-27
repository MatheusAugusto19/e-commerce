import React, { useState, useEffect, createContext } from "react";

const STORAGE_KEY = "ecommerce_cart";

// Criação do Contexto
export const CartContext = createContext();

// Função para carregar do localStorage
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      return [];
    }
  }
  return [];
};

// Provider para envolver a app
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());

  // Salvar dados no LocalStorage quando cartItems mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Adicionar item ao carrinho
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Se já existe, aumenta quantidade
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Se não existe, adiciona novo com quantidade 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Remover item do carrinho
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // Aumentar quantidade
  const increaseQuantity = (productId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Diminuir quantidade
  const decreaseQuantity = (productId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Quantidade total de itens
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
