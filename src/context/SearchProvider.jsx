import React, { useState, useCallback, useEffect } from 'react';
import { SearchContext } from './createSearchContext';

export const SearchProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('ecommerce_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions, setSuggestions] = useState([]);

  // Salvar histórico no localStorage
  useEffect(() => {
    localStorage.setItem('ecommerce_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Adicionar busca ao histórico
  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      // Remover duplicatas e adicionar no início
      const filtered = prev.filter((item) => item.query !== query.trim());
      return [
        { query: query.trim(), timestamp: new Date().toISOString() },
        ...filtered,
      ].slice(0, 20); // Manter apenas últimas 20 buscas
    });
  }, []);

  // Limpar histórico
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Remover item específico do histórico
  const removeFromHistory = useCallback((query) => {
    setSearchHistory((prev) => prev.filter((item) => item.query !== query));
  }, []);

  // Gerar sugestões baseadas em produtos disponíveis
  const generateSuggestions = useCallback(
    (query, allProducts) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const q = query.toLowerCase();

      // Buscar produtos que contenham o query
      const productMatches = allProducts
        .filter((product) => product.name.toLowerCase().includes(q))
        .map((product) => ({ type: 'product', value: product.name, id: product.id }))
        .slice(0, 5);

      // Buscar categorias
      const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];
      const categoryMatches = uniqueCategories
        .filter((cat) => cat.toLowerCase().includes(q))
        .map((cat) => ({ type: 'category', value: cat }))
        .slice(0, 3);

      // Buscar no histórico
      const historyMatches = searchHistory
        .filter((item) => item.query.toLowerCase().includes(q))
        .map((item) => ({ type: 'history', value: item.query }))
        .slice(0, 3);

      setSuggestions([...productMatches, ...categoryMatches, ...historyMatches]);
    },
    [searchHistory]
  );

  // Buscar com filtros avançados
  const advancedSearch = useCallback(
    (query, filters = {}) => {
      addToHistory(query);

      return {
        query: query.trim(),
        filters: {
          category: filters.category || null,
          minPrice: filters.minPrice || null,
          maxPrice: filters.maxPrice || null,
          rating: filters.rating || null,
          inWishlist: filters.inWishlist || false,
        },
      };
    },
    [addToHistory]
  );

  // Obter sugestões rápidas (últimas buscas)
  const getQuickSuggestions = useCallback(() => {
    return searchHistory.slice(0, 5);
  }, [searchHistory]);

  const value = {
    searchHistory,
    suggestions,
    addToHistory,
    clearHistory,
    removeFromHistory,
    generateSuggestions,
    advancedSearch,
    getQuickSuggestions,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
