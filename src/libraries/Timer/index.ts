import { CreateTimer, Timer } from "./types";

/**
 *
 * @param param0
 * @returns
 */
export const createTimer: CreateTimer = ({ tickInterval, onTick }) => {
  let handler = null;
  let timerRef: Partial<Timer> = {
    tickCount: 0,
  };

  const start = () => {
    handler = setInterval(() => {
      timerRef.tickCount++;
      onTick && onTick(timerRef.tickCount);
    }, tickInterval);
  };

  const stop = () => {
    clearInterval(handler);
  };

  timerRef.start = start;
  timerRef.stop = stop;

  return timerRef as Timer;
};
