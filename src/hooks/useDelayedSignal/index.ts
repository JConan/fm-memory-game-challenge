import { useEffect, useRef, useState } from "react";

interface useDelayedSignalProps {
  delay?: number;
}

type UseDelayedSignal = (props?: useDelayedSignalProps) => {
  state: boolean;
  pulse: () => void;
};

const defaultProps: useDelayedSignalProps = { delay: 100 };

export const useDelayedSignal: UseDelayedSignal = ({
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
