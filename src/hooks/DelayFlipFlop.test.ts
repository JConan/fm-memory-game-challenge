import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { useDelayFlipFlop } from "./DelayFlipFlop";

describe("hook for DelayFlipFlop", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should have to change state after single pulse", () => {
    const { result } = renderHook(() => useDelayFlipFlop());
    expect(result.current.state).toBe(false);

    act(() => {
      result.current.pulse();
    });
    expect(result.current.state).toBe(true);
  });

  it("should have state back to false after 100ms since last pulse", () => {
    const { result } = renderHook(() => useDelayFlipFlop());

    act(() => {
      result.current.pulse();
      jest.advanceTimersByTime(100);
    });
    expect(result.current.state).toBe(false);
  });

  it("should have be able to override default delay of 100ms", () => {
    const { result } = renderHook(() =>
      useDelayFlipFlop({
        delay: 300,
      })
    );

    act(() => {
      result.current.pulse();
      jest.advanceTimersByTime(100);
    });
    expect(result.current.state).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.state).toBe(false);
  });

  it("shoudl use the last pulse as reference for delay", () => {
    const { result } = renderHook(() => useDelayFlipFlop());

    act(() => {
      result.current.pulse();
      jest.advanceTimersByTime(50);
    });
    expect(result.current.state).toBe(true);

    act(() => {
      result.current.pulse();
      jest.advanceTimersByTime(50);
    });
    expect(result.current.state).toBe(true);

    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current.state).toBe(false);
  });
});