import React from 'react';
import { useProduct } from '../context/useProduct';
import './Pagination.scss';

export default function Pagination({ totalItems }) {
  const { currentPage, totalPages, goToPage } = useProduct();

  if (totalPages <= 1) {
    return null; // Não exibir paginação se houver apenas uma página
  }

  // Gerar números de página para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn prev-btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        title="Página anterior"
      >
        ← Anterior
      </button>

      <div className="pagination-numbers">
        {/* Botão para primeira página se não estiver visível */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              className="pagination-btn page-btn"
              onClick={() => goToPage(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {/* Números de página */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`pagination-btn page-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        {/* Botão para última página se não estiver visível */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-btn page-btn"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className="pagination-btn next-btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Próxima página"
      >
        Próximo →
      </button>

      <span className="pagination-info">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}
