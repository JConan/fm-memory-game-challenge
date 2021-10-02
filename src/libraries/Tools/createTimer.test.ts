import { createTimer } from "./createTimer";

describe("timer function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be able to run", () => {
    const timer = createTimer({ tickInterval: 1000 });
    expect(timer.tickCount).toEqual(0);

    timer.start();

    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(1);
    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(2);
    jest.advanceTimersByTime(3000);
    expect(timer.tickCount).toEqual(5);
  });

  it("should be able to stop and start", () => {
    const timer = createTimer({ tickInterval: 1000 });
    expect(timer.tickCount).toEqual(0);

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(1);

    timer.stop();
    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(1);

    timer.start();
    jest.advanceTimersByTime(3000);
    expect(timer.tickCount).toEqual(4);
  });

  it("should be able that have a callback", () => {
    const mock = jest.fn();
    const timer = createTimer({ tickInterval: 100, onTick: mock });
    expect(timer.tickCount).toEqual(0);

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mock).toBeCalledTimes(10);
  });

  it("should be safe to call multiple time start/stop op", () => {
    const timer = createTimer({ tickInterval: 1000 });

    timer.start();
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(1);

    timer.stop();
    timer.stop();
    jest.advanceTimersByTime(1000);
    expect(timer.tickCount).toEqual(1);

    timer.start();
    timer.start();
    jest.advanceTimersByTime(4000);

    expect(timer.tickCount).toEqual(5);
  });
});
