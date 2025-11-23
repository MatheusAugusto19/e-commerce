import React, { useState } from 'react';
import { useReview } from '../context/useReview';
import { useNotification } from '../context/useNotification';
import './ReviewSection.scss';

export default function ReviewSection({ productId }) {
  const { addReview, getProductReviews, getProductRating } = useReview();
  const { addNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
  });

  const productReviews = getProductReviews(productId);
  const averageRating = getProductRating(productId);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.title || !formData.comment) {
      addNotification('Preencha todos os campos!', 'error', 2000);
      return;
    }

    addReview(productId, {
      name: formData.name,
      email: formData.email,
      rating: parseInt(formData.rating),
      title: formData.title,
      comment: formData.comment,
    });

    addNotification('Avaliação enviada com sucesso! ⭐', 'success', 2000);
    
    setFormData({
      name: '',
      email: '',
      rating: 5,
      title: '',
      comment: '',
    });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <div className="review-section">
      <div className="reviews-header">
        <h3>Avaliações ({productReviews.length})</h3>
        {averageRating > 0 && (
          <div className="average-rating">
            <span className="rating-stars">{renderStars(averageRating)}</span>
            <span className="rating-value">{averageRating}/5</span>
          </div>
        )}
      </div>

      <button
        className="add-review-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '✖️ Cancelar' : '✏️ Escrever Avaliação'}
      </button>

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Avaliação:</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
            >
              <option value="1">⭐ Péssimo</option>
              <option value="2">⭐⭐ Ruim</option>
              <option value="3">⭐⭐⭐ Bom</option>
              <option value="4">⭐⭐⭐⭐ Muito Bom</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
            </select>
          </div>

          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Resumo da sua avaliação"
            />
          </div>

          <div className="form-group">
            <label>Comentário:</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Compartilhe sua experiência com este produto..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            📤 Enviar Avaliação
          </button>
        </form>
      )}

      {productReviews.length === 0 ? (
        <div className="no-reviews">
          <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar! 🌟</p>
        </div>
      ) : (
        <div className="reviews-list">
          {productReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-info">
                  <h4>{review.title}</h4>
                  <span className="review-author">por {review.name}</span>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <span className="review-rating">
                  {renderStars(review.rating)}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
