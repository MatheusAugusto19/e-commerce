import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/useSearch';
import { useFilter } from '../context/useFilter';
import './SearchBar.scss';

export default function SearchBar({ onSearch }) {
  const { suggestions, generateSuggestions, getQuickSuggestions } = useSearch();
  const { getFilteredProducts, setSearchQuery } = useFilter();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allProducts = getFilteredProducts();

  // Gerar sugestões quando digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        generateSuggestions(query, allProducts);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, generateSuggestions, allProducts]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setSearchQuery(searchQuery);
    setQuery('');
    setShowSuggestions(false);
    onSearch?.(searchQuery);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      setQuery(suggestion.value);
    } else if (suggestion.type === 'category') {
      handleSearch(suggestion.value);
    } else if (suggestion.type === 'history') {
      handleSearch(suggestion.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const quickSuggestions = getQuickSuggestions();

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar produtos..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
        />
        <button className="search-btn" onClick={() => handleSearch()}>
          🔍
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`suggestion-item suggestion-${suggestion.type}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">
                {suggestion.type === 'product' && '📦'}
                {suggestion.type === 'category' && '🏷️'}
                {suggestion.type === 'history' && '⏱️'}
              </span>
              <span className="suggestion-text">{suggestion.value}</span>
              {suggestion.type === 'product' && (
                <span className="suggestion-meta">Produto</span>
              )}
            </div>
          ))}
        </div>
      )}

      {query && suggestions.length === 0 && (
        <div className="suggestions-dropdown">
          <div className="no-suggestions">Nenhuma sugestão encontrada</div>
        </div>
      )}

      {!query && quickSuggestions.length > 0 && showSuggestions && (
        <div className="suggestions-dropdown">
          <div className="quick-title">⏱️ Buscas Recentes</div>
          {quickSuggestions.map((item, idx) => (
            <div
              key={idx}
              className="suggestion-item suggestion-history"
              onClick={() => handleSearch(item.query)}
            >
              <span className="suggestion-icon">⏱️</span>
              <span className="suggestion-text">{item.query}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
