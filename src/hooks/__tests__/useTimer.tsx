import { act, renderHook } from "@testing-library/react-hooks";
import { useTimer } from "../useTimer";

describe("useTimer provide time counter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should start with 0:00", async () => {
    const { result } = renderHook(() => useTimer());
    result.current.start();

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
    result.current.start();

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

  it("should be able to restart", () => {
    const { result } = renderHook(() => useTimer());
    result.current.start();

    for (let i = 0; i < 90; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(result.current.value).toBe("1:30");

    act(() => {
      jest.advanceTimersByTime(5500);
    });

    act(() => {
      result.current.restart();
    });
    expect(result.current.value).toBe("0:00");

    for (let i = 0; i < 90; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(result.current.value).toBe("1:30");
  });
});
