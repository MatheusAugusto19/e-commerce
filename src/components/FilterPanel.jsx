import React from 'react';
import { useFilter } from '../context/useFilter';
import './FilterPanel.scss';

export default function FilterPanel() {
  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    setSearchQuery,
    getCategories,
  } = useFilter();

  const categories = getCategories();

  const categoryLabels = {
    all: 'Todos os Produtos',
    eletrônicos: 'Eletrônicos',
    acessórios: 'Acessórios',
    periféricos: 'Periféricos',
  };

  return (
    <aside className="filter-panel">
      <div className="filters-container">
        {/* Filtro de Categoria */}
        <div className="filter-section">
          <h3>Categoria</h3>
          <div className="category-list">
            {categories.map(category => (
              <label key={category} className="category-item">
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
        <div className="filter-section">
          <h3>Preço</h3>
          <div className="price-inputs">
            <div className="price-input-group">
              <label>De:</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="price-input"
              />
            </div>
            <div className="price-input-group">
              <label>Até:</label>
              <input
                type="number"
                min="0"
                max="3000"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: parseInt(e.target.value) || 1000,
                  })
                }
                className="price-input"
              />
            </div>
          </div>
          <div className="price-range-slider">
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
              className="range-slider"
            />
          </div>
          <div className="price-display">
            R$ {priceRange.min} - R$ {priceRange.max}
          </div>
        </div>

        {/* Filtro de Ordenação */}
        <div className="filter-section">
          <h3>Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        <button
          className="clear-filters-btn"
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setPriceRange({ min: 0, max: 1000 });
            setSortBy('newest');
          }}
        >
          🔄 Limpar Filtros
        </button>
      </div>
    </aside>
  );
}
