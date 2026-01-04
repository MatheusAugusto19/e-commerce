import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import styles from './SearchBar.module.scss';

export default function SearchBar({ onSearch }) {
  const {
    setSearchQuery,
    suggestions,
    generateSuggestions,
    getQuickSuggestions,
  } = useStore(state => ({
    setSearchQuery: state.setSearchQuery,
    suggestions: state.suggestions,
    generateSuggestions: state.generateSuggestions,
    getQuickSuggestions: state.getQuickSuggestions,
  }));
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Gerar sugestões quando digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        generateSuggestions(query);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, generateSuggestions]);

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
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Buscar produtos..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
        />
        <button className={styles.searchBtn} onClick={() => handleSearch()}>
          🔍
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestionsDropdown}>
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`${styles.suggestionItem} ${styles[`suggestion-${suggestion.type}`]}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className={styles.suggestionIcon}>
                {suggestion.type === 'product' && '📦'}
                {suggestion.type === 'category' && '🏷️'}
                {suggestion.type === 'history' && '⏱️'}
              </span>
              <span className={styles.suggestionText}>{suggestion.value}</span>
              {suggestion.type === 'product' && (
                <span className={styles.suggestionMeta}>Produto</span>
              )}
            </div>
          ))}
        </div>
      )}

      {query && suggestions.length === 0 && (
        <div className={styles.suggestionsDropdown}>
          <div className={styles.noSuggestions}>Nenhuma sugestão encontrada</div>
        </div>
      )}

      {!query && quickSuggestions.length > 0 && showSuggestions && (
        <div className={styles.suggestionsDropdown}>
          <div className={styles.quickTitle}>⏱️ Buscas Recentes</div>
          {quickSuggestions.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.suggestionItem} ${styles.suggestionHistory}`}
              onClick={() => handleSearch(item.query)}
            >
              <span className={styles.suggestionIcon}>⏱️</span>
              <span className={styles.suggestionText}>{item.query}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
