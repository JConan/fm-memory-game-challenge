import { act, renderHook } from "@testing-library/react-hooks";
import { useTimer } from "./Timer";

describe("hook for Timer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should start with 0:00", async () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.value).toBe("0:00");

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.value).toBe("0:03");

    act(() => {
      jest.advanceTimersByTime(90 * 1000);
    });
    expect(result.current.value).toBe("1:33");
  });

  it("should able to stop/start", async () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.value).toBe("0:00");

    act(() => {
      jest.advanceTimersByTime(3000);
      result.current.stop();
      jest.advanceTimersByTime(3000);
      result.current.start();
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.value).toBe("0:04");
  });
});
