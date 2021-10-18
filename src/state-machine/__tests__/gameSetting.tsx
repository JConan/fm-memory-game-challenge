import { gameSettingMachine, GameSetting, SettingEvents } from "../gameSetting";
import { testMachine } from "../helpers";

describe("toggle test", () => {
  const defaultSetting = {
    gridSize: "4x4",
    numberOfPlayer: 1,
    theme: "Numbers",
  };

  it("should load default setting when no data is store in local", async () => {
    const fakeService = jest.fn(() => Promise.resolve(null));

    const { waitForStateToBe } = testMachine(
      gameSettingMachine.withConfig({
        services: {
          loadFromLocalStore: fakeService,
        },
      })
    );

    const { state } = await waitForStateToBe("ready");

    expect(fakeService).toBeCalledTimes(1);
    expect(state.context).toEqual(defaultSetting);
  });

  it("should able to retrieve setting from local storage", async () => {
    const customSetting: GameSetting = {
      gridSize: "6x6",
      numberOfPlayer: 4,
      theme: "Icons",
    };
    const fakeService = jest.fn(() => Promise.resolve(customSetting));
    const { waitForStateToBe } = testMachine(
      gameSettingMachine.withConfig({
        services: {
          loadFromLocalStore: fakeService,
        },
      })
    );

    const { state } = await waitForStateToBe("ready");
    expect(fakeService).toBeCalledTimes(1);
    expect(state.context).toEqual(customSetting);
  });

  it("should be able to update setting", async () => {
    const { send, waitForStateToBe } = testMachine(gameSettingMachine);

    let result = await waitForStateToBe("ready");

    send({
      type: "UPDATE_SETTING",
      setting: { gridSize: "6x6" },
    } as SettingEvents);

    result = await waitForStateToBe("ready", result);

    expect(result.state.context).toHaveProperty("gridSize", "6x6");
  });

  it("should be able to update multiple setting", async () => {
    const { send, waitForStateToBe } = testMachine(gameSettingMachine);

    let result = await waitForStateToBe("ready");

    send({
      type: "UPDATE_SETTING",
      setting: { gridSize: "6x6", theme: "Icons" },
    } as SettingEvents);

    result = await waitForStateToBe("ready", result);

    expect(result.state.context).toHaveProperty("gridSize", "6x6");
    expect(result.state.context).toHaveProperty("theme", "Icons");
  });
});
