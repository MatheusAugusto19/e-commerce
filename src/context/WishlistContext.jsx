import React, { useState, useEffect, createContext } from 'react';

const API_URL = "http://localhost:5000/wishlist";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setWishlistItems(data));
  }, []);

  const addToWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (!exists) {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) => {
          setWishlistItems((prevItems) => [...prevItems, data]);
        });
    }
  };

  const removeFromWishlist = (productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
    }).then(() => {
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    wishlistItems.forEach((item) => {
      fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE',
      });
    });
    setWishlistItems([]);
  };

  const getTotalWishlistItems = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getTotalWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
