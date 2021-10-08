import { Timer, createTimer } from "../libraries/Tools";

export interface SoloGameScore {
  move: {
    getCount: () => number;
    add: () => void;
  };
  timer: Timer & {
    toString: () => string;
  };
}

export class SoloGameScore {
  private counter: number = 0;

  constructor() {
    this.move = {
      getCount: () => this.counter,
      add: () => this.counter++,
    };

    this.timer = {
      ...createTimer({ tickInterval: 1000 }),
      toString: () => {
        const seconds = `${this.timer.getTickCount() % 60}`.padStart(2, "0");
        const minutes = Math.floor(this.timer.getTickCount() / 60);
        return `${minutes}:${seconds}`;
      },
    };
  }
}
