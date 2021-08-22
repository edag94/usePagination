import * as React from 'react';

export interface PaginationConfig {
  initialItemCount: number,
  initialPageNumber: number,
  initialItemsPerPage: number
}

export const usePagination = ({initialItemCount, initialPageNumber = 1, initialItemsPerPage = 10}: PaginationConfig) => {
  const [currentPage, setCurrentPage] = React.useState(initialPageNumber);
  const [itemsPerPage, _setItemsPerPage] = React.useState(initialItemsPerPage);

  const lastItemIndex = initialItemCount - 1;
  const maxPage = Math.floor(lastItemIndex / itemsPerPage) + 1; // if remainder, need an extra page

  const canGetNext = currentPage < maxPage;
  const canGetPrev = currentPage > 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage !== maxPage ? startIndex + itemsPerPage : lastItemIndex;

  const setItemsPerPage = (newItemsPerPage: number) => {
    // Jump to page that would contain the current startIndex
    const newStartIndexPageNumber = Math.floor(startIndex / newItemsPerPage) + 1;
    setCurrentPage(newStartIndexPageNumber);
    _setItemsPerPage(newItemsPerPage);
  };

  const currentData = (data: unknown[]) => {
    return data.slice(startIndex, endIndex)
  }

  const next = () => {
    if (canGetNext) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  const prev = () => {
    if (canGetPrev) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  };

  const jump = (page: number) => {
    // Math.max and Math.min to stay within the page range [1, maxPage]
    const pageNumber = Math.max(1, page);
    setCurrentPage((_currentPage) => Math.min(pageNumber, maxPage));
  };

  return {
    startIndex,
    endIndex,
    canGetNext,
    next,
    canGetPrev,
    prev,
    jump,
    currentData,
    currentPage,
    maxPage,
    setItemsPerPage,
  };
};