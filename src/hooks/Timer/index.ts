import { useCallback, useEffect, useRef, useState } from "react";
import { createTimer } from "libraries/Tools";
import { UseTimer } from "./types";

export const useTimer: UseTimer = () => {
  const isMounted = useRef(true);
  const [value, setvalue] = useState("0:00");

  const { start, stop } = createTimer({
    tickInterval: 1000,
    onTick: useCallback((count) => {
      const seconds = `${count % 60}`.padStart(2, "0");
      const minutes = Math.floor(count / 60);
      isMounted.current && setvalue(`${minutes}:${seconds}`);
    }, []),
  });

  useEffect(() => {
    start();
    return () => {
      isMounted.current = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { value, start, stop };
};
