import { renderHook, act } from "@testing-library/react-hooks";
import { PaginationConfig, usePagination, UsePaginationResult } from ".";

// mock timer using jest
jest.useFakeTimers();

describe("usePagination", () => {
  it("works correctly", () => {
    const config: PaginationConfig = {
      itemCount: 100,
      initialPageNumber: 0,
      initialItemsPerPage: 10,
    };
    const { result, rerender } = renderHook(() => usePagination(config));

    const initExpectedState: StateToValidate = {
      firstItemIndex: 0,
      lastItemIndex: 9,
      canGetNext: true,
      canGetPrev: false,
      currentPageIndex: 0,
      lastPageIndex: 9,
    };
    validateState(result.current, initExpectedState);

    // Go to next page
    act(() => {
      result.current.next();
    });

    let expectedState: StateToValidate = {
      firstItemIndex: 10,
      lastItemIndex: 19,
      canGetNext: true,
      canGetPrev: true,
      currentPageIndex: 1,
      lastPageIndex: 9,
    };
    validateState(result.current, expectedState);

    // Go to prev page
    act(() => {
      result.current.prev();
    });

    validateState(result.current, initExpectedState);

    // Jump to middle of data
    act(() => {
      result.current.jump(Math.floor(initExpectedState.lastPageIndex / 2));
    });

    expectedState = {
      firstItemIndex: 40,
      lastItemIndex: 49,
      canGetNext: true,
      canGetPrev: true,
      currentPageIndex: 4,
      lastPageIndex: 9,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage
    act(() => {
      result.current.setItemsPerPage(7);
    });

    // expect firstItemIndex <= prevfirstItemIndex <= lastItemIndex
    expectedState = {
      firstItemIndex: 35,
      lastItemIndex: 41,
      canGetNext: true,
      canGetPrev: true,
      currentPageIndex: 5,
      lastPageIndex: 14,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where firstItemIndex === prevfirstItemIndex, so where prevfirstItemIndex % itemsPerPage === 0
    act(() => {
      result.current.setItemsPerPage(5);
    });

    // expect firstItemIndex === prevfirstItemIndex
    expectedState = {
      firstItemIndex: 35,
      lastItemIndex: 39,
      canGetNext: true,
      canGetPrev: true,
      currentPageIndex: 7,
      lastPageIndex: 19,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where lastItemIndex === prevlastItemIndex
    act(() => {
      result.current.setItemsPerPage(20);
    });

    // expect lastItemIndex === prevlastItemIndex
    expectedState = {
      firstItemIndex: 20,
      lastItemIndex: 39,
      canGetNext: true,
      canGetPrev: true,
      currentPageIndex: 1,
      lastPageIndex: 4,
    };
    validateState(result.current, expectedState);

    // test rerender of hook with less items, and currentPageIndex > lastPageIndex. An example of when this would happen is with filtering
    act(() => {
      result.current.setItemsPerPage(10);
      result.current.jump(result.current.lastPageIndex);
    });
    config.itemCount = 15;
    rerender();

    expectedState = {
      firstItemIndex: 10,
      lastItemIndex: 14,
      canGetNext: false,
      canGetPrev: true,
      currentPageIndex: 1, // should go to lastPageIndex
      lastPageIndex: 1,
    };
    validateState(result.current, expectedState);

    // test rerender of hook with 0 items. An example of when this would happen is with filtering
    config.itemCount = 0;
    rerender();

    expectedState = {
      firstItemIndex: 0,
      lastItemIndex: 0,
      canGetNext: false,
      canGetPrev: false,
      currentPageIndex: 0,
      lastPageIndex: 0,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where itemsPerPage < 0
    const errorThrowing = () => {
      result.current.setItemsPerPage(-1);
    };
    expect(errorThrowing).toThrowError();
  });
});

type PropertiesToValidate = Extract<
  keyof UsePaginationResult,
  | "firstItemIndex"
  | "lastItemIndex"
  | "canGetNext"
  | "canGetPrev"
  | "currentPageIndex"
  | "lastPageIndex"
>;

type StateToValidate = Pick<UsePaginationResult, PropertiesToValidate>;

const validateState = (hookResult: UsePaginationResult, expectedState: StateToValidate) => {
  for (const property in expectedState) {
    const prop = property as PropertiesToValidate;
    expect(hookResult[prop]).toBe(expectedState[prop]);
  }
};
