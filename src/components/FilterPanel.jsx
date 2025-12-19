import useStore from '../store/useStore';
import styles from './FilterPanel.module.scss';

export default function FilterPanel() {
  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    setSearchQuery,
    categories,
  } = useStore(state => ({
    selectedCategory: state.selectedCategory,
    setSelectedCategory: state.setSelectedCategory,
    priceRange: state.priceRange,
    setPriceRange: state.setPriceRange,
    sortBy: state.sortBy,
    setSortBy: state.setSortBy,
    setSearchQuery: state.setSearchQuery,
    categories: state.categories(),
  }));

  const categoryLabels = {
    all: 'Todos os Produtos',
    eletrônicos: 'Eletrônicos',
    acessórios: 'Acessórios',
    periféricos: 'Periféricos',
  };

  return (
    <aside className={styles.filterPanel}>
      <div className={styles.filtersContainer}>
        {/* Filtro de Categoria */}
        <div className={styles.filterSection}>
          <h3>Categoria</h3>
          <div className={styles.categoryList}>
            {categories.map(category => (
              <label key={category} className={styles.categoryItem}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                />
                <span>{categoryLabels[category] || category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro de Preço */}
        <div className={styles.filterSection}>
          <h3>Preço</h3>
          <div className={styles.priceInputs}>
            <div className={styles.priceInputGroup}>
              <label>De:</label>
              <input
                type="number"
                min="0"
                max="3000"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className={styles.priceInput}
              />
            </div>
            <div className={styles.priceInputGroup}>
              <label>Até:</label>
              <input
                type="number"
                min="0"
                max="3000"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: parseInt(e.target.value) || 3000,
                  })
                }
                className={styles.priceInput}
              />
            </div>
          </div>
          <div className={styles.priceRangeSlider}>
            <input
              type="range"
              min="0"
              max="3000"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: parseInt(e.target.value),
                })
              }
              className={styles.rangeSlider}
            />
          </div>
          <div className={styles.priceDisplay}>
            R$ {priceRange.min} - R$ {priceRange.max}
          </div>
        </div>

        {/* Filtro de Ordenação */}
        <div className={styles.filterSection}>
          <h3>Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        <button
          className={styles.clearFiltersBtn}
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setPriceRange({ min: 0, max: 3000 });
            setSortBy('newest');
          }}
        >
          🔄 Limpar Filtros
        </button>
      </div>
    </aside>
  );
}
