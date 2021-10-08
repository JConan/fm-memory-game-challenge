import { GridSize } from "../../hooks/useGameSetting";

export interface CreateTimerProps {
  tickInterval: number;
  onTick?: (tickCount: number) => void;
}

export interface Timer {
  getTickCount: () => number;
  start: () => void;
  stop: () => void;
  restart: () => void;
}

export type CreateTimer = (args: CreateTimerProps) => Timer;

export interface GenerateTileValuesProps {
  gridSize: GridSize;
}

export type GenerateTileValues = (props: GenerateTileValuesProps) => number[];
