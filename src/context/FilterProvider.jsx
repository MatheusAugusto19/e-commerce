import React, { useState, useCallback, useMemo } from 'react';
import { FilterContext } from './createFilterContext';

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');

  // Produtos de amostra com categorias
  const allProducts = useMemo(() => [
    {
      id: 1,
      name: 'Smartphone Premium',
      price: 1200,
      image: '📱',
      category: 'eletrônicos',
      rating: 4.8,
      reviews: 150,
    },
    {
      id: 2,
      name: 'Fone Bluetooth',
      price: 350,
      image: '🎧',
      category: 'acessórios',
      rating: 4.5,
      reviews: 89,
    },
    {
      id: 3,
      name: 'Smartwatch',
      price: 800,
      image: '⌚',
      category: 'eletrônicos',
      rating: 4.7,
      reviews: 120,
    },
    {
      id: 4,
      name: 'Mochila Tech',
      price: 250,
      image: '🎒',
      category: 'acessórios',
      rating: 4.3,
      reviews: 65,
    },
    {
      id: 5,
      name: 'Carregador Rápido',
      price: 150,
      image: '🔌',
      category: 'acessórios',
      rating: 4.6,
      reviews: 200,
    },
    {
      id: 6,
      name: 'Câmera Digital',
      price: 2500,
      image: '📷',
      category: 'eletrônicos',
      rating: 4.9,
      reviews: 110,
    },
    {
      id: 7,
      name: 'Teclado Mecânico',
      price: 500,
      image: '⌨️',
      category: 'periféricos',
      rating: 4.4,
      reviews: 95,
    },
    {
      id: 8,
      name: 'Mouse Gamer',
      price: 300,
      image: '🖱️',
      category: 'periféricos',
      rating: 4.7,
      reviews: 140,
    },
    {
      id: 9,
      name: 'Monitor 4K',
      price: 1800,
      image: '🖥️',
      category: 'eletrônicos',
      rating: 4.8,
      reviews: 105,
    },
  ], []);

  // Filtrar e ordenar produtos
  const getFilteredProducts = useCallback(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Ordenar
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy, allProducts]);

  const getCategories = () => {
    const categories = ['all'];
    allProducts.forEach(product => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    return categories;
  };

  const value = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    getFilteredProducts,
    getCategories,
    allProducts,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
