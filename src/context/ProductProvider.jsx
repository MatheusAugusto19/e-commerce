import React, {
  useState,
  useCallback,
  useMemo,
  createContext,
  useEffect,
} from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // === MASTER PRODUCT LIST (from FilterProvider) ===
  const allProducts = useMemo(
    () => [
      { id: 1, name: "Smartphone Premium", price: 1200, image: "📱", category: "eletrônicos", rating: 4.8, reviews: 150 },
      { id: 2, name: "Fone Bluetooth", price: 350, image: "🎧", category: "acessórios", rating: 4.5, reviews: 89 },
      { id: 3, name: "Smartwatch", price: 800, image: "⌚", category: "eletrônicos", rating: 4.7, reviews: 120 },
      { id: 4, name: "Mochila Tech", price: 250, image: "🎒", category: "acessórios", rating: 4.3, reviews: 65 },
      { id: 5, name: "Carregador Rápido", price: 150, image: "🔌", category: "acessórios", rating: 4.6, reviews: 200 },
      { id: 6, name: "Câmera Digital", price: 2500, image: "📷", category: "eletrônicos", rating: 4.9, reviews: 110 },
      { id: 7, name: "Teclado Mecânico", price: 500, image: "⌨️", category: "periféricos", rating: 4.4, reviews: 95 },
      { id: 8, name: "Mouse Gamer", price: 300, image: "🖱️", category: "periféricos", rating: 4.7, reviews: 140 },
      { id: 9, name: "Monitor 4K", price: 1800, image: "🖥️", category: "eletrônicos", rating: 4.8, reviews: 105 },
    ],
    []
  );

  // === FILTERING & SORTING STATE (from FilterProvider) ===
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");

  // === PAGINATION STATE (from PaginationProvider) ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // === SEARCH UI STATE (from SearchProvider) ===
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("ecommerce_search_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestions, setSuggestions] = useState([]);

  // Salvar histórico no localStorage
  useEffect(() => {
    localStorage.setItem("ecommerce_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);


  // === DERIVED STATE: FILTERED PRODUCTS ===
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy, allProducts]);
  
  // === PAGINATION LOGIC (depends on filteredProducts) ===
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length, itemsPerPage]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredProducts]);

  const goToPage = useCallback((pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, [totalPages]);

  // === ENHANCED SETTERS (with pagination reset) ===
  const handleSetSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };
  
  const handleSetSelectedCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  
  const handleSetPriceRange = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };
  
  const handleSetSortBy = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };
  
  const handleSetItemsPerPage = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }

  // === HELPER FUNCTIONS ===
  const getCategories = useMemo(() => {
    const categories = ["all"];
    allProducts.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    return categories;
  }, [allProducts]);

  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.query !== query.trim());
      return [{ query: query.trim(), timestamp: new Date().toISOString() }, ...filtered].slice(0, 20);
    });
  }, []);

  const generateSuggestions = useCallback(
    (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      const q = query.toLowerCase();
      const productMatches = allProducts
        .filter((product) => product.name.toLowerCase().includes(q))
        .map((product) => ({ type: 'product', value: product.name, id: product.id }))
        .slice(0, 5);
      const categoryMatches = getCategories
        .filter((cat) => cat.toLowerCase().includes(q))
        .map((cat) => ({ type: 'category', value: cat }))
        .slice(0, 3);
      const historyMatches = searchHistory
        .filter((item) => item.query.toLowerCase().includes(q))
        .map((item) => ({ type: 'history', value: item.query }))
        .slice(0, 3);
      setSuggestions([...productMatches, ...categoryMatches, ...historyMatches]);
    },
    [allProducts, getCategories, searchHistory]
  );

  const getQuickSuggestions = useCallback(() => {
    return searchHistory.slice(0, 5);
  }, [searchHistory]);

  // === CONTEXT VALUE ===
  const value = {
    // State
    allProducts,
    filteredProducts,
    paginatedProducts,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    currentPage,
    itemsPerPage,
    totalPages,
    searchHistory,
    suggestions,
    // Setters
    setSearchQuery: handleSetSearchQuery,
    setSelectedCategory: handleSetSelectedCategory,
    setPriceRange: handleSetPriceRange,
    setSortBy: handleSetSortBy,
    setItemsPerPage: handleSetItemsPerPage,
    goToPage,
    // Helpers
    getCategories,
    addToHistory,
    generateSuggestions,
    getQuickSuggestions,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
