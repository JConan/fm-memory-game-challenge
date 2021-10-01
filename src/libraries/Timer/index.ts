import { CreateTimer, Timer } from "./types";

export const createTimer: CreateTimer = ({ tickInterval, onTick }) => {
  let handle: NodeJS.Timeout | undefined = undefined;
  let timerRef: Timer = {
    tickCount: 0,
    stop: () => {
      if (handle) {
        clearInterval(handle);
        handle = undefined;
      }
    },
    start: () => {
      if (handle === undefined) {
        handle = setInterval(() => {
          timerRef.tickCount++;
          onTick && onTick(timerRef.tickCount);
        }, tickInterval);
      }
    },
  };

  return timerRef;
};
