import { createTimer } from "../createTimer";

describe("timer function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be able to run", () => {
    const timer = createTimer({ tickInterval: 1000 });
    expect(timer.getTickCount()).toEqual(0);

    timer.start();

    jest.advanceTimersByTime(1000);
    expect(timer.getTickCount()).toEqual(1);
    jest.advanceTimersByTime(1000);
    expect(timer.getTickCount()).toEqual(2);
    jest.advanceTimersByTime(3000);
    expect(timer.getTickCount()).toEqual(5);
  });

  it("should be able to stop and start", () => {
    const timer = createTimer({ tickInterval: 1000 });
    expect(timer.getTickCount()).toEqual(0);

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(timer.getTickCount()).toEqual(1);

    timer.stop();
    jest.advanceTimersByTime(10000);
    expect(timer.getTickCount()).toEqual(1);

    timer.start();
    jest.advanceTimersByTime(3000);
    expect(timer.getTickCount()).toEqual(4);
  });

  it("should be able that have a callback", () => {
    const mock = jest.fn();
    const timer = createTimer({ tickInterval: 100, onTick: mock });
    expect(timer.getTickCount()).toEqual(0);

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mock).toBeCalledTimes(10);
  });

  it("should be safe to call multiple time start/stop op", () => {
    const timer = createTimer({ tickInterval: 1000 });

    timer.start();
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(timer.getTickCount()).toEqual(1);

    timer.stop();
    timer.stop();
    jest.advanceTimersByTime(1000);
    expect(timer.getTickCount()).toEqual(1);

    timer.start();
    timer.start();
    jest.advanceTimersByTime(4000);

    expect(timer.getTickCount()).toEqual(5);
  });

  it("should be able to restart", () => {
    const timer = createTimer({ tickInterval: 1000 });
    timer.start();

    for (let i = 1; i <= 100; i++) {
      jest.advanceTimersByTime(100);
      const elapsedTime = (100 * i) / 1000;
      expect(timer.getTickCount()).toEqual(Math.floor(elapsedTime));
    }

    jest.advanceTimersByTime(900);

    timer.restart();
    expect(timer.getTickCount()).toEqual(0);
    for (let i = 1; i <= 100; i++) {
      jest.advanceTimersByTime(100);
      const elapsedTime = (100 * i) / 1000;
      expect(timer.getTickCount()).toEqual(Math.floor(elapsedTime));
    }
  });
});
