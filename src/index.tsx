import * as React from 'react';

export interface PaginationConfig {
  itemCount: number,
  initialPageNumber: number,
  initialItemsPerPage: number
}

export interface PaginationReturn {
  startIndex: number;
  endIndex: number;
  canGetNext: boolean;
  next: () => void;
  canGetPrev: boolean;
  prev: () => void;
  jump: (page: number) => void;
  getCurrentData: (data: unknown[]) => unknown[];
  currentPage: number;
  maxPage: number;
  setItemsPerPage: (newItemsPerPage: number) => void;
}

export const usePagination = ({itemCount, initialPageNumber = 1, initialItemsPerPage = 10}: PaginationConfig): PaginationReturn => {
  const [currentPage, setCurrentPage] = React.useState(initialPageNumber);
  const [itemsPerPage, _setItemsPerPage] = React.useState(initialItemsPerPage);

  const lastItemIndex = itemCount - 1;
  const maxPage = Math.floor(lastItemIndex / itemsPerPage) + 1; // if remainder, need an extra page

  const canGetNext = currentPage < maxPage;
  const canGetPrev = currentPage > 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage !== maxPage ? startIndex + itemsPerPage : itemCount;

  const setItemsPerPage = (newItemsPerPage: number) => {
    if (newItemsPerPage < 1) {
      // just use old itemsPerPage, as items per page cannot be less than 1
      throw new Error("items per page must be greater than 0");
    }
    // Jump to page that would contain the current startIndex
    const newStartIndexPageNumber = Math.floor(startIndex / newItemsPerPage) + 1;
    setCurrentPage(newStartIndexPageNumber);
    _setItemsPerPage(newItemsPerPage);
  };

  const getCurrentData = (data: unknown[]) => {
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
    if (page < 1 || page > maxPage) {
      throw new Error(`Page to jump to must be [1, maxPage]`)
    }
    const pageNumber = Math.max(1, page);
    setCurrentPage((_currentPage) => Math.min(pageNumber, maxPage));
  };

  // if currently on x page, and item count changes to a lower number so that currentPage > maxPage, goto max page
  React.useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [itemCount]);

  return {
    startIndex,
    endIndex,
    canGetNext,
    next,
    canGetPrev,
    prev,
    jump,
    getCurrentData,
    currentPage,
    maxPage,
    setItemsPerPage,
  };
};