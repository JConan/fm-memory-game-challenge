import { GameSetting, Setting } from "./GameSetting";
import store from "store2";

describe("Class GameConfig for storing game settings", () => {
  it("should be have initial settings", () => {
    const config = new GameSetting();

    const settings = config.getSetting();
    expect(settings).toMatchObject({
      theme: "Numbers",
      gridSize: "4x4",
      numberOfPlayers: 1,
    });
  });

  it("should be able to change settings", () => {
    const config = new GameSetting();

    config.setTheme("Icons");
    config.setGridSize("6x6");
    config.setNumberOfPlayers(4);
    expect(config.getSetting().theme).toEqual("Icons");
    expect(config.getSetting().gridSize).toEqual("6x6");
    expect(config.getSetting().numberOfPlayers).toEqual(4);
  });

  it("should have all setters return a Promise", () => {
    const config = new GameSetting();

    return Promise.all([
      config.setTheme("Icons").then((setting) => {
        expect(setting).toMatchObject({
          theme: "Icons",
          gridSize: "4x4",
          numberOfPlayers: 1,
        });
      }),
      config.setGridSize("6x6").then((setting) => {
        expect(setting).toMatchObject({
          theme: "Icons",
          gridSize: "6x6",
          numberOfPlayers: 1,
        });
      }),
      config.setNumberOfPlayers(4).then((setting) => {
        expect(setting).toMatchObject({
          theme: "Icons",
          gridSize: "6x6",
          numberOfPlayers: 4,
        });
      }),
    ]);
  });

  describe("persist settings in local storage", () => {
    const defaultSettings: Setting = {
      theme: "Numbers",
      gridSize: "4x4",
      numberOfPlayers: 1,
    };

    it("should return default settings if there is no data in local store", () => {
      const mockedGet = jest.spyOn(store, "get").mockReturnValueOnce(null);
      const config = new GameSetting();

      return config.localStore.load().then<void>((setting) => {
        expect(mockedGet).toBeCalledTimes(1);
        expect(setting).toMatchObject(defaultSettings);
      });
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
      const config = new GameSetting();

      return config.localStore.load().then<void>((setting) => {
        expect(mockedGet).toBeCalledTimes(1);
        expect(mockedGet).toBeCalledWith("GameConfig");
        expect(setting).toMatchObject(gameSetting);
      });
    });
    it("should be able to save setting in local store", () => {
      const mockedSet = jest.spyOn(store, "set");
      const config = new GameSetting();
      return config.localStore.save().then<void>((setting) => {
        expect(mockedSet).toBeCalledTimes(1);
        expect(mockedSet).toBeCalledWith("GameConfig", defaultSettings, true);
        expect(setting).toMatchObject(defaultSettings);
      });
    });
  });
});
