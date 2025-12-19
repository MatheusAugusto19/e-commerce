import useStore from '../store/useStore';
import styles from './Pagination.module.scss';

export default function Pagination() {
  const { currentPage, totalPages, goToPage } = useStore(state => ({
    currentPage: state.pagination().currentPage,
    totalPages: state.pagination().totalPages,
    goToPage: state.goToPage,
  }));

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
    <div className={styles.paginationContainer}>
      <button
        className={`${styles.paginationBtn} ${styles.prevBtn}`}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        title="Página anterior"
      >
        ← Anterior
      </button>

      <div className={styles.paginationNumbers}>
        {/* Botão para primeira página se não estiver visível */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              className={`${styles.paginationBtn} ${styles.pageBtn}`}
              onClick={() => goToPage(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className={styles.paginationEllipsis}>...</span>}
          </>
        )}

        {/* Números de página */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.paginationBtn} ${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        {/* Botão para última página se não estiver visível */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className={styles.paginationEllipsis}>...</span>
            )}
            <button
              className={`${styles.paginationBtn} ${styles.pageBtn}`}
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={`${styles.paginationBtn} ${styles.nextBtn}`}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Próxima página"
      >
        Próximo →
      </button>

      <span className={styles.paginationInfo}>
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}
