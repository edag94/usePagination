import { PaginationConfig, PaginationReturn, usePagination } from "./";
import { renderHook, act } from "@testing-library/react-hooks";

// mock timer using jest
jest.useFakeTimers();

describe("usePagination", () => {
  it("works correctly", () => {
    const data = (() => {
      const data: number[] = [];
      for (let i = 0; i < 100; ++i) {
        data.push(i);
      }
      return data;
    })();

    const config: PaginationConfig = {
      initialItemCount: data.length,
      initialPageNumber: 1,
      initialItemsPerPage: 10,
    };
    const { result } = renderHook(() => usePagination(config));

    const initExpectedState: StateToValidate = {
      startIndex: 0,
      endIndex: 10,
      canGetNext: true,
      canGetPrev: false,
      currentPage: 1,
      maxPage: 10,
    };
    validateState(result.current, initExpectedState);

    // Go to next page
    act(() => {
      result.current.next();
    });

    let expectedState: StateToValidate = {
      startIndex: 10,
      endIndex: 20,
      canGetNext: true,
      canGetPrev: true,
      currentPage: 2,
      maxPage: 10,
    };
    validateState(result.current, expectedState);

    // Go to prev page
    act(() => {
      result.current.prev();
    });

    validateState(result.current, initExpectedState);

    // Jump to middle of data
    act(() => {
      result.current.jump(initExpectedState.maxPage / 2);
    });

    expectedState = {
      startIndex: 40,
      endIndex: 50,
      canGetNext: true,
      canGetPrev: true,
      currentPage: 5,
      maxPage: 10,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage
    act(() => {
      result.current.setItemsPerPage(7);
    });

    // expect startIndex <= prevStartIndex <= endIndex
    expectedState = {
      startIndex: 35,
      endIndex: 42,
      canGetNext: true,
      canGetPrev: true,
      currentPage: 6,
      maxPage: 15,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where startIndex === prevStartIndex, so where prevStartIndex % itemsPerPage === 0
    act(() => {
      result.current.setItemsPerPage(5);
    });

    // expect startIndex === prevStartIndex
    expectedState = {
      startIndex: 35,
      endIndex: 40,
      canGetNext: true,
      canGetPrev: true,
      currentPage: 8,
      maxPage: 20,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where endIndex === prevEndIndex
    act(() => {
      result.current.setItemsPerPage(20);
    });

    // expect endIndex === prevEndIndex
    expectedState = {
      startIndex: 20,
      endIndex: 40,
      canGetNext: true,
      canGetPrev: true,
      currentPage: 2,
      maxPage: 5,
    };
    validateState(result.current, expectedState);

    // Set new itemsPerPage, test edge case where itemsPerPage < 1
    const errorThrowing = () => {
      result.current.setItemsPerPage(0);
    };
    expect(errorThrowing).toThrowError();
  });
});

type StateToValidate = Pick<
  PaginationReturn,
  | "startIndex"
  | "endIndex"
  | "canGetNext"
  | "canGetPrev"
  | "currentPage"
  | "maxPage"
>;

const validateState = (
  hookResult: PaginationReturn,
  expectedState: StateToValidate
) => {
  for (const property in expectedState) {
    expect(hookResult[property]).toBe(expectedState[property]);
  }
};
