import { CreateTimer } from "./types";

export const createTimer: CreateTimer = ({ tickInterval, onTick }) => {
  const dataRef: { intervalHandle?: NodeJS.Timeout; tickCount: number } = {
    tickCount: 0,
  };

  const start = () => {
    if (dataRef.intervalHandle === undefined) {
      dataRef.intervalHandle = setInterval(() => {
        dataRef.tickCount++;
        onTick && onTick(dataRef.tickCount);
      }, tickInterval);
    }
  };

  const stop = () => {
    dataRef.intervalHandle && clearInterval(dataRef.intervalHandle);
    dataRef.intervalHandle = undefined;
  };

  return {
    getTickCount: () => dataRef.tickCount,
    start,
    stop,
    restart: () => {
      dataRef.tickCount = 0;
      stop();
      start();
    },
  };
};
