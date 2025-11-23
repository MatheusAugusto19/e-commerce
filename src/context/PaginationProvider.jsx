import React, { useState, useCallback } from 'react';
import { PaginationContext } from './createPaginationContext';

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 12 produtos por página

  // Calcular total de páginas baseado no número total de itens
  const getTotalPages = useCallback((totalItems) => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [itemsPerPage]);

  // Obter índices de início e fim para fatiar os dados
  const getPaginationRange = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  }, [currentPage, itemsPerPage]);

  // Fatiar produtos para a página atual
  const getPaginatedItems = useCallback((items) => {
    const { startIndex, endIndex } = getPaginationRange();
    return items.slice(startIndex, endIndex);
  }, [getPaginationRange]);

  // Ir para página específica
  const goToPage = useCallback((pageNumber, totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [getTotalPages]);

  // Ir para próxima página
  const nextPage = useCallback((totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (currentPage < totalPages) {
      goToPage(currentPage + 1, totalItems);
    }
  }, [currentPage, getTotalPages, goToPage]);

  // Ir para página anterior
  const prevPage = useCallback((totalItems) => {
    if (currentPage > 1) {
      goToPage(currentPage - 1, totalItems);
    }
  }, [currentPage, goToPage]);

  // Reset para página 1 quando filtros mudarem
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Alterar quantidade de itens por página
  const setItemsPerPageValue = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset para página 1 ao mudar items per page
  }, []);

  const value = {
    currentPage,
    itemsPerPage,
    getTotalPages,
    getPaginationRange,
    getPaginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    setItemsPerPageValue,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};
