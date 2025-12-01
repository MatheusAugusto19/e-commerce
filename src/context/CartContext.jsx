import React, { useReducer, useEffect, createContext } from "react";

const API_URL = "http://localhost:5000/cart";

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;
    case "ADD_TO_CART":
      return [...state, action.payload];
    case "UPDATE_CART_ITEM":
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "SET_CART", payload: data }));
  }, []);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      fetch(`${API_URL}/${existingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })
        .then((res) => res.json())
        .then((data) => dispatch({ type: "UPDATE_CART_ITEM", payload: data }));
    } else {
      const newItem = { ...product, quantity: 1 };
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((data) => dispatch({ type: "ADD_TO_CART", payload: data }));
    }
  };

  const removeFromCart = (productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
    }).then(() => dispatch({ type: "REMOVE_FROM_CART", payload: productId }));
  };

  const increaseQuantity = (productId) => {
    const itemToUpdate = cartItems.find((item) => item.id === productId);
    const updatedItem = { ...itemToUpdate, quantity: itemToUpdate.quantity + 1 };

    fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    })
      .then((res) => res.json())
      .then((data) => dispatch({ type: "UPDATE_CART_ITEM", payload: data }));
  };

  const decreaseQuantity = (productId) => {
    const itemToUpdate = cartItems.find((item) => item.id === productId);
    if (itemToUpdate.quantity > 1) {
      const updatedItem = { ...itemToUpdate, quantity: itemToUpdate.quantity - 1 };

      fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })
        .then((res) => res.json())
        .then((data) => dispatch({ type: "UPDATE_CART_ITEM", payload: data }));
    }
  };

  const clearCart = () => {
    cartItems.forEach((item) => {
      fetch(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });
    });
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
