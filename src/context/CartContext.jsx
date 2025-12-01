import React, { useState, useEffect, createContext } from "react";

const API_URL = "http://localhost:5000/cart";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      "      .then((data) => setCartItems(data));"
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
        .then((data) => {
          setCartItems(cartItems.map((item) => (item.id === product.id ? data : item)));
        });
    } else {
      const newItem = { ...product, quantity: 1 };
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((data) => {
          setCartItems([...cartItems, data]);
        });
    }
  };

  const removeFromCart = (productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
    }).then(() => {
      setCartItems(cartItems.filter((item) => item.id !== productId));
    });
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
      .then((data) => {
        setCartItems(cartItems.map((item) => (item.id === productId ? data : item)));
      });
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
        .then((data) => {
          setCartItems(cartItems.map((item) => (item.id === productId ? data : item)));
        });
    }
  };

  const clearCart = () => {
    cartItems.forEach((item) => {
      fetch(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });
    });
    setCartItems([]);
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
