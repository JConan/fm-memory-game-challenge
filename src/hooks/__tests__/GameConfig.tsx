import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { GameSettings, useGameConfig } from "../GameConfig";
import store from "store2";

describe("hook for GameConfig", () => {
  it("should have initial value", () => {
    const { result } = renderHook(() => useGameConfig());
    const defaultSettings: Partial<GameSettings> = {
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

  it("should load default settings if no data is in local storage", () => {
    const settings = {
      gridSize: "4x4",
      numberOfPlayer: "1",
      theme: "Numbers",
    } as GameSettings;
    const mockedGet = jest.spyOn(store, "get").mockReturnValueOnce(null);

    const { result } = renderHook(() =>
      useGameConfig({ useLocalStorage: true })
    );

    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("game-settings");

    expect(result.current).toMatchObject(settings);
  });

  it("should load settings from local storage", () => {
    const settings = {
      gridSize: "6x6",
      numberOfPlayer: "2",
      theme: "Icons",
    } as GameSettings;
    const mockedGet = jest.spyOn(store, "get").mockReturnValueOnce(settings);

    const { result } = renderHook(() =>
      useGameConfig({ useLocalStorage: true })
    );

    expect(mockedGet).toBeCalledWith("game-settings");

    expect(result.current).toMatchObject(settings);
  });

  it("should not load settings from local storage", () => {
    const settings = {
      gridSize: "6x6",
      numberOfPlayer: "2",
      theme: "Icons",
    } as GameSettings;
    const mockedGet = jest.spyOn(store, "get").mockReturnValue(settings);

    const { result } = renderHook(() =>
      useGameConfig({ useLocalStorage: false })
    );

    expect(mockedGet).not.toBeCalled();
    expect(result.current).not.toMatchObject(settings);
  });

  it("should store settings to local storage", () => {
    jest.spyOn(store, "get").mockReturnValue(null);
    const mockedSet = jest.spyOn(store, "set");

    const { result } = renderHook(() =>
      useGameConfig({ useLocalStorage: true })
    );

    act(() => {
      result.current.setGridSize("6x6");
    });

    expect(mockedSet).toBeCalledTimes(1);
  });
});
