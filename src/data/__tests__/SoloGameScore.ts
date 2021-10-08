import { SoloGameScore } from "../SoloGameScore";

describe("Class SoloGameScore for storing moves counter and elapsed time", () => {
  it("should be have initial value", () => {
    const score = new SoloGameScore();

    expect(score.move.getCount()).toEqual(0);
    expect(score.timer.toString()).toEqual("0:00");
  });

  it("should be able to increment counter", () => {
    const score = new SoloGameScore();

    score.move.add();
    expect(score.move.getCount()).toEqual(1);

    for (let i = 0; i < 10; i++) {
      score.move.add();
    }
    expect(score.move.getCount()).toEqual(11);
  });

  it("should be able to have a working timer", () => {
    jest.useFakeTimers();
    const score = new SoloGameScore();

    score.timer.start();
    jest.advanceTimersByTime(93000);
    expect(score.timer.toString()).toBe("1:33");

    jest.useRealTimers();
  });
});
