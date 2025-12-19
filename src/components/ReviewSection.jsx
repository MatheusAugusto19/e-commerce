import { useState } from 'react';
import useStore from '../store/useStore';
import styles from './ReviewSection.module.scss';

export default function ReviewSection({ productId }) {
  const { addReview, getProductReviews, getProductRating, addNotification } = useStore();
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
    <div className={styles.reviewSection}>
      <div className={styles.reviewsHeader}>
        <h3>Avaliações ({productReviews.length})</h3>
        {averageRating > 0 && (
          <div className={styles.averageRating}>
            <span className={styles.ratingStars}>{renderStars(averageRating)}</span>
            <span className={styles.ratingValue}>{averageRating}/5</span>
          </div>
        )}
      </div>

      <button
        className={styles.addReviewBtn}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '✖️ Cancelar' : '✏️ Escrever Avaliação'}
      </button>

      {showForm && (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.formGroup}>
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

          <div className={styles.formGroup}>
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Resumo da sua avaliação"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Comentário:</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Compartilhe sua experiência com este produto..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            📤 Enviar Avaliação
          </button>
        </form>
      )}

      {productReviews.length === 0 ? (
        <div className={styles.noReviews}>
          <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar! 🌟</p>
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {productReviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewInfo}>
                  <h4>{review.title}</h4>
                  <span className={styles.reviewAuthor}>por {review.name}</span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <span className={styles.reviewRating}>
                  {renderStars(review.rating)}
                </span>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
