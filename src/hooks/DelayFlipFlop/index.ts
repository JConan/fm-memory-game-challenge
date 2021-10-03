import { useEffect, useRef, useState } from "react";

interface useDelayFlipFlopProps {
  delay?: number;
}

type UseDelayFlipFlop = (props?: useDelayFlipFlopProps) => {
  state: boolean;
  pulse: () => void;
};

const defaultProps: useDelayFlipFlopProps = { delay: 100 };

export const useDelayFlipFlop: UseDelayFlipFlop = ({
  delay,
} = defaultProps) => {
  const isMounted = useRef(true);
  const handle = useRef<number>();
  const [state, setState] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    state,
    pulse: () => {
      clearInterval(handle.current);

      if (isMounted.current) {
        setState(true);
        handle.current = setTimeout(() => {
          isMounted.current && setState(false);
        }, delay);
      }
    },
  };
};
