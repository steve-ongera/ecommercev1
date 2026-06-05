import { useState, useCallback } from 'react';

const usePagination = (initialPage = 1, initialLimit = 12) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const updatePagination = useCallback((newTotal, newLimit = limit) => {
    setTotal(newTotal);
    const pages = Math.ceil(newTotal / newLimit);
    setTotalPages(pages);
    if (page > pages) {
      setPage(pages > 0 ? pages : 1);
    }
  }, [limit, page]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    updatePagination,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

export default usePagination;