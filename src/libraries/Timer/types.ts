export interface CreateTimerProps {
  tickInterval: number;
  onTick?: (tickCount: number) => void;
}

export interface Timer {
  tickCount: number;
  start: () => void;
  stop: () => void;
}

export type CreateTimer = (args: CreateTimerProps) => Timer;
