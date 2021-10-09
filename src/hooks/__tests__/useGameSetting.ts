import { renderHook } from "@testing-library/react-hooks";
import { useGameSetting, Setting } from "../useGameSetting";

import store from "store2";
import { act } from "react-dom/test-utils";

describe("useGameSetting for managing settings", () => {
  it("should be have initial settings", () => {
    const { result } = renderHook(() => useGameSetting());

    expect(result.current.value).toMatchObject({
      theme: "Numbers",
      gridSize: "4x4",
      numberOfPlayers: 1,
    });
  });

  it("should be able to change settings", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useGameSetting());
    await act(async () => {
      result.current.setTheme("Icons");
      await waitForNextUpdate();
      result.current.setGridSize("6x6");
      result.current.setNumberOfPlayers(4);
    });
    expect(result.current.value.theme).toEqual("Icons");
    expect(result.current.value.gridSize).toEqual("6x6");
    expect(result.current.value.numberOfPlayers).toEqual(4);
  });

  it("should have all setters return a Promise", () => {
    const { result } = renderHook(() => useGameSetting());

    act(() => {
      result.current.setTheme("Icons");
    });
    expect(result.current.value).toMatchObject({
      theme: "Icons",
      gridSize: "4x4",
      numberOfPlayers: 1,
    });

    act(() => {
      result.current.setGridSize("6x6");
    });
    expect(result.current.value).toMatchObject({
      theme: "Icons",
      gridSize: "6x6",
      numberOfPlayers: 1,
    });

    act(() => {
      result.current.setNumberOfPlayers(4);
    });
    expect(result.current.value).toMatchObject({
      theme: "Icons",
      gridSize: "6x6",
      numberOfPlayers: 4,
    });
  });

  describe("persist settings in local storage", () => {
    const defaultSettings: Setting = {
      theme: "Numbers",
      gridSize: "4x4",
      numberOfPlayers: 1,
    };

    it("should return default settings if there is no data in local store", () => {
      const mockedGet = jest.spyOn(store, "get").mockReturnValueOnce(null);
      const { result } = renderHook(() => useGameSetting());

      result.current.localStore.load();
      expect(mockedGet).toBeCalledTimes(1);
      expect(result.current.value).toMatchObject(defaultSettings);
    });
    it("should be able load setting from local store", () => {
      const gameSetting: Setting = {
        theme: "Icons",
        gridSize: "6x6",
        numberOfPlayers: 4,
      };
      const mockedGet = jest
        .spyOn(store, "get")
        .mockReturnValueOnce(gameSetting);
      const { result } = renderHook(() => useGameSetting());

      act(() => {
        result.current.localStore.load();
      });

      expect(mockedGet).toBeCalledTimes(1);
      expect(mockedGet).toBeCalledWith("GameSetting");
      expect(result.current.value).toMatchObject(gameSetting);
    });
    it("should be able to save setting in local store", () => {
      const mockedSet = jest.spyOn(store, "set");
      const { result } = renderHook(() => useGameSetting());

      result.current.localStore.save();
      expect(mockedSet).toBeCalledTimes(1);
      expect(mockedSet).toBeCalledWith("GameSetting", defaultSettings, true);
      expect(result.current.value).toMatchObject(defaultSettings);
    });
  });
});
