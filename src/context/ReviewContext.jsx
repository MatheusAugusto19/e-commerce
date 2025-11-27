import React, { useState, useEffect, createContext } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ecommerce_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('ecommerce_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      productId,
      ...review,
      createdAt: new Date().toISOString(),
    };

    setReviews((prevReviews) => [newReview, ...prevReviews]);
    return newReview;
  };

  const getProductReviews = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  const getProductRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;

    const totalRating = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / productReviews.length).toFixed(1);
  };

  const deleteReview = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  const updateReview = (reviewId, updatedData) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, ...updatedData } : review
      )
    );
  };

  const value = {
    reviews,
    addReview,
    getProductReviews,
    getProductRating,
    deleteReview,
    updateReview,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};
