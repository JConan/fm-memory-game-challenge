import { renderHook } from "@testing-library/react-hooks";
import { GameSettings } from "./types";
import { useGameConfig } from ".";
import { act } from "react-dom/test-utils";

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
  it("should be able to change gridSize", () => {
    const { result } = renderHook(() => useGameConfig());
    act(() => result.current.setGridSize("6x6"));
    expect(result.current.gridSize).toEqual("6x6");
  });
  it("should be able to number of players", () => {
    const { result } = renderHook(() => useGameConfig());
    act(() => result.current.setNumberOfPlayers("4"));
    expect(result.current.numberOfPlayer).toEqual("4");
  });
  it("should be able to change theme", () => {
    const { result } = renderHook(() => useGameConfig());
    act(() => result.current.setTheme("Icons"));
    expect(result.current.theme).toEqual("Icons");
  });
});
