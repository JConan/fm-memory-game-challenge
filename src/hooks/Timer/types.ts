interface UseTimerProps {}

export type UseTimer = (props?: UseTimerProps) => TimerHooks;

export interface TimerHooks {
  value: string;
  start: () => void;
  stop: () => void;
  restart: () => void;
}
