const productSlice = (set, get) => ({
  // === STATE ===
  allProducts: [
    { id: 1, name: "Smartphone Premium", price: 1200, image: "📱", category: "eletrônicos", rating: 4.8, reviews: 150, stock: 10, inStock: true, features: ["Tela AMOLED", "Câmera de 108MP", "Bateria de 5000mAh"], specifications: { "Tela": "6.7 polegadas", "Processador": "Snapdragon 8 Gen 2", "RAM": "12GB", "Armazenamento": "256GB" } },
    { id: 2, name: "Fone Bluetooth", price: 350, image: "🎧", category: "acessórios", rating: 4.5, reviews: 89, stock: 30, inStock: true, features: ["Cancelamento de Ruído", "20h de Bateria", "Case de Carregamento"], specifications: { "Conexão": "Bluetooth 5.2", "Driver": "40mm", "Peso": "250g" } },
    { id: 3, name: "Smartwatch", price: 800, image: "⌚", category: "eletrônicos", rating: 4.7, reviews: 120, stock: 15, inStock: true, features: ["Monitoramento Cardíaco", "GPS Integrado", "À Prova d'Água"], specifications: { "Tela": "1.4 polegadas", "Bateria": "7 dias", "Compatibilidade": "Android/iOS" } },
    { id: 4, name: "Mochila Tech", price: 250, image: "🎒", category: "acessórios", rating: 4.3, reviews: 65, stock: 25, inStock: true, features: ["Compartimento para Notebook", "Porta USB", "Material Impermeável"], specifications: { "Capacidade": "25L", "Material": "Nylon", "Peso": "800g" } },
    { id: 5, name: "Carregador Rápido", price: 150, image: "🔌", category: "acessórios", rating: 4.6, reviews: 200, stock: 50, inStock: true, features: ["65W de Potência", "Porta USB-C", "Compatibilidade Universal"], specifications: { "Potência": "65W", "Portas": "1x USB-C, 1x USB-A", "Tamanho": "Compacto" } },
    { id: 6, name: "Câmera Digital", price: 2500, image: "📷", category: "eletrônicos", rating: 4.9, reviews: 110, stock: 8, inStock: true, features: ["Sensor Full-Frame", "Gravação 4K", "Lentes Intercambiáveis"], specifications: { "Sensor": "24MP", "ISO": "100-51200", "Peso": "680g" } },
    { id: 7, name: "Teclado Mecânico", price: 500, image: "⌨️", category: "periféricos", rating: 4.4, reviews: 95, stock: 20, inStock: true, features: ["Switches Red", "RGB Customizável", "Layout ABNT2"], specifications: { "Tipo": "Mecânico", "Switches": "Outemu Red", "Conexão": "USB-C" } },
    { id: 8, name: "Mouse Gamer", price: 300, image: "🖱️", category: "periféricos", rating: 4.7, reviews: 140, stock: 40, inStock: true, features: ["16000 DPI", "Design Ergonômico", "6 Botões Programáveis"], specifications: { "Sensor": "Óptico", "DPI": "16000", "Peso": "95g" } },
    { id: 9, name: "Monitor 4K", price: 1800, image: "🖥️", category: "eletrônicos", rating: 4.8, reviews: 105, stock: 12, inStock: true, features: ["27 Polegadas", "Painel IPS", "HDR10"], specifications: { "Resolução": "3840x2160", "Taxa de Atualização": "60Hz", "Painel": "IPS" } },
  ],
  searchQuery: "",
  selectedCategory: "all",
  priceRange: { min: 0, max: 3000 },
  sortBy: "newest",
  currentPage: 1,
  itemsPerPage: 6,
  searchHistory: [],
  suggestions: [],

  // === ACTIONS ===
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().addToHistory(query);
  },
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setItemsPerPage: (value) => set({ itemsPerPage: value, currentPage: 1 }),
  goToPage: (pageNumber) => {
    const { totalPages } = get().pagination();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      set({ currentPage: pageNumber });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  setSearchHistory: (history) => set({ searchHistory: history }),
  addToHistory: (query) => {
    if (!query.trim()) return;
    set((state) => {
      const filtered = state.searchHistory.filter((item) => item.query !== query.trim());
      return { searchHistory: [{ query: query.trim(), timestamp: new Date().toISOString() }, ...filtered].slice(0, 20) };
    });
  },
  generateSuggestions: (query) => {
    if (!query.trim()) {
      set({ suggestions: [] });
      return;
    }
    const q = query.toLowerCase();
    const { allProducts, categories, searchHistory } = get();
    const productMatches = allProducts
      .filter((product) => product.name.toLowerCase().includes(q))
      .map((product) => ({ type: 'product', value: product.name, id: product.id }))
      .slice(0, 5);
    const categoryMatches = categories()
      .filter((cat) => cat.toLowerCase().includes(q))
      .map((cat) => ({ type: 'category', value: cat }))
      .slice(0, 3);
    const historyMatches = searchHistory
      .filter((item) => item.query.toLowerCase().includes(q))
      .map((item) => ({ type: 'history', value: item.query }))
      .slice(0, 3);
    set({ suggestions: [...productMatches, ...categoryMatches, ...historyMatches] });
  },

  // === DERIVED STATE & HELPERS (as functions) ===
  categories: () => {
    const { allProducts } = get();
    const categories = ["all"];
    allProducts.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    return categories;
  },
  filteredProducts: () => {
    let { allProducts, searchQuery, selectedCategory, priceRange, sortBy } = get();
    
    let filtered = allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });

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
  },
  pagination: () => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().filteredProducts();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      paginatedProducts,
      totalItems: filtered.length,
    }
  },
  getQuickSuggestions: () => {
    return get().searchHistory.slice(0, 5);
  },
  getProductById: (id) => {
    return get().allProducts.find(p => p.id === id);
  },
});

export default productSlice;
