const reviewSlice = (set, get) => ({
  reviews: [],

  _setReviews: (reviews) => set({ reviews }),

  addReview: (productId, review) => {
    const newReview = {
      id: Date.now(),
      productId,
      ...review,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ reviews: [newReview, ...state.reviews] }));
    return newReview;
  },

  getProductReviews: (productId) => {
    return get().reviews.filter((review) => review.productId === productId);
  },

  getProductRating: (productId) => {
    const productReviews = get().getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / productReviews.length).toFixed(1);
  },
});

export default reviewSlice;
