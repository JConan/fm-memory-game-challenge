import { renderHook } from "@testing-library/react-hooks";
import { useGameConfig } from "../GameConfig";
import { GameSettings } from "./types";

describe("hook for GameConfig", () => {
  it("should have initial value", () => {
    const { result } = renderHook(() => useGameConfig());
    const defaultSettings: GameSettings = {
      gridSize: "4x4",
      numberOfPlayer: "1",
      theme: "Numbers",
    };
    expect(result.current).toMatchObject(defaultSettings);
  });
});