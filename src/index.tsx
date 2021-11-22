import { useEffect } from "react";
import { useImmer } from "use-immer";

export interface PaginationConfig {
  itemCount: number;
  initialPageNumber?: number;
  initialItemsPerPage?: number;
}

export interface UsePaginationResult {
  firstItemIndex: number;
  lastItemIndex: number;
  canGetNext: boolean;
  next: () => void;
  canGetPrev: boolean;
  prev: () => void;
  jump: (page: number) => void;
  getCurrentData: (data: unknown[]) => unknown[];
  currentPageIndex: number;
  lastPageIndex: number;
  setItemsPerPage: (newItemsPerPage: number) => void;
}

interface UsePaginationState {
  currentPageIndex: number;
  itemsPerPage: number;
}

const indexWouldBeOnPage = (arrayIndex: number, itemsPerPage: number) => {
  const pageIndex = Math.floor(arrayIndex / itemsPerPage);
  return pageIndex;
};

export const usePagination = ({
  itemCount,
  initialPageNumber = 0,
  initialItemsPerPage = 10,
}: PaginationConfig): UsePaginationResult => {
  const [{ currentPageIndex, itemsPerPage }, setState] = useImmer<UsePaginationState>({
    currentPageIndex: initialPageNumber,
    itemsPerPage: initialItemsPerPage,
  });

  const lastItemIndexOnLastPage = Math.max(0, itemCount - 1); // Math.max(0, x) protects against the case where itemCount === 0, which is the only edge case where the math in this hook doesn't work
  const lastPageIndex = indexWouldBeOnPage(lastItemIndexOnLastPage, itemsPerPage);

  const canGetNext = currentPageIndex < lastPageIndex;
  const canGetPrev = currentPageIndex > 0;

  const firstItemIndex = currentPageIndex * itemsPerPage;
  const lastItemIndex = Math.min(lastItemIndexOnLastPage, firstItemIndex + itemsPerPage - 1); // Math.min(lastItemIndexOnLastPage, x) handles the case where we are on the last page, and the page isn't completely filled

  const setItemsPerPage = (newItemsPerPage: number) => {
    if (newItemsPerPage < 0) {
      throw new Error("items per page must be greater than 0");
    }
    const newCurrentPageIndex = indexWouldBeOnPage(firstItemIndex, newItemsPerPage);
    setState((draft) => {
      draft.currentPageIndex = newCurrentPageIndex;
      draft.itemsPerPage = newItemsPerPage;
    });
  };

  const getCurrentData = (data: unknown[]) => {
    return data.slice(firstItemIndex, lastItemIndex + 1); // slice is exclusive of the last item
  };

  const next = () => {
    if (canGetNext) {
      setState((draft) => {
        draft.currentPageIndex = draft.currentPageIndex + 1;
      });
    }
  };

  const prev = () => {
    if (canGetPrev) {
      setState((draft) => {
        draft.currentPageIndex = draft.currentPageIndex - 1;
      });
    }
  };

  const jump = (newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex > lastPageIndex) {
      throw new Error(`Page to jump to must be [0, maxPage]`);
    }
    setState((draft) => {
      draft.currentPageIndex = Math.min(newPageIndex, lastPageIndex);
    });
  };

  // if currently on x page, and item count changes to a lower number so that currentPage > maxPage, goto max page
  /* 
  For example, filtering will change the itemCount passed into this hook. 
  But if you're on a page that would have a higher item count, than the resulting item count after filtering, 
  you'll be stuck with having to go back a few pages to see the data, as you're in an invalid state where the current page is past the last page of items. 
  This uesEffect hook will handle that for you by going to the last page, whenever itemCount is changed and the condition is true
  */
  useEffect(() => {
    if (currentPageIndex > lastPageIndex) {
      setState((draft) => {
        draft.currentPageIndex = lastPageIndex;
      });
    }
  }, [itemCount, currentPageIndex, lastPageIndex, setState]);

  return {
    firstItemIndex,
    lastItemIndex,
    canGetNext,
    next,
    canGetPrev,
    prev,
    jump,
    getCurrentData,
    currentPageIndex,
    lastPageIndex,
    setItemsPerPage,
  };
};
