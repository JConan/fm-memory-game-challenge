import { useEffect, useRef, useState } from "react";
import { createTimer, Timer } from "../../libraries/Tools";
import { UseTimer } from "./types";

export const useTimer: UseTimer = () => {
  const isMounted = useRef(true);
  const [value, setvalue] = useState("0:00");
  const timer = useRef<Timer>();

  useEffect(() => {
    timer.current = createTimer({
      tickInterval: 1000,
      onTick: (count) => {
        const seconds = `${count % 60}`.padStart(2, "0");
        const minutes = Math.floor(count / 60);
        isMounted.current && setvalue(`${minutes}:${seconds}`);
      },
    });

    return () => {
      isMounted.current = false;
      timer.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    value,
    start: () => {
      timer.current?.start();
    },
    stop: () => {
      timer.current?.stop();
    },
    restart: () => {
      timer.current?.restart();
      setvalue("0:00");
    },
  };
};
