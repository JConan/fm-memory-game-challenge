import { SettingMachine, SettingContext, SettingEvents } from "../Setting";
import { testMachine } from "../helpers";
import store from "store2";

describe("Game setting state machine", () => {
  const defaultSetting = {
    gridSize: "4x4",
    numberOfPlayer: 1,
    theme: "Numbers",
  };

  it("should load default setting when no data is store in local", async () => {
    const fakeService = jest.spyOn(store, "get");
    const { waitForStateToBe, getStatesSequence } = testMachine(SettingMachine);
    const { state } = await waitForStateToBe("ready");

    expect(fakeService).toBeCalledTimes(1);
    expect(state.context).toEqual(defaultSetting);
    expect(getStatesSequence()).toEqual(["created", "loading", "ready"]);
    fakeService.mockRestore();
  });

  it("should able to retrieve setting from local storage", async () => {
    const customSetting: SettingContext = {
      gridSize: "6x6",
      numberOfPlayer: 4,
      theme: "Icons",
    };
    const fakeService = jest.spyOn(store, "get");
    fakeService.mockImplementationOnce(() => Promise.resolve(customSetting));
    const { waitForStateToBe, getStatesSequence } = testMachine(SettingMachine);
    const { state } = await waitForStateToBe("ready");

    expect(fakeService).toBeCalledTimes(1);
    expect(state.context).toEqual(customSetting);
    expect(getStatesSequence()).toEqual(["created", "loading", "ready"]);
    fakeService.mockRestore();
  });

  it("should be able to update setting", async () => {
    const { send, waitForStateToBe, getStatesSequence } =
      testMachine(SettingMachine);

    let result = await waitForStateToBe("ready");

    send({
      type: "UPDATE_SETTING",
      data: { gridSize: "6x6" },
    } as SettingEvents);

    result = await waitForStateToBe("ready", result);

    expect(result.state.context).toHaveProperty("gridSize", "6x6");
    expect(getStatesSequence()).toEqual([
      "created",
      "loading",
      "ready",
      "ready",
    ]);
  });

  it("should be able to update multiple setting", async () => {
    const { send, waitForStateToBe } = testMachine(SettingMachine);

    let result = await waitForStateToBe("ready");

    send({
      type: "UPDATE_SETTING",
      data: { gridSize: "6x6", theme: "Icons" },
    } as SettingEvents);

    result = await waitForStateToBe("ready", result);

    expect(result.state.context).toHaveProperty("gridSize", "6x6");
    expect(result.state.context).toHaveProperty("theme", "Icons");
  });

  it("should be able to save setting to local storage", async () => {
    const fakeService = jest.fn(() => Promise.resolve(true));

    const { send, waitForStateToBe, getStatesSequence } = testMachine(
      SettingMachine.withConfig({
        services: {
          saveSetting: fakeService,
        },
      })
    );

    const result = await waitForStateToBe("ready");

    send({ type: "SAVE_SETTING" } as SettingEvents);

    await waitForStateToBe("ready", result);

    expect(fakeService).toBeCalledTimes(1);
    expect(getStatesSequence()).toEqual([
      "created",
      "loading",
      "ready",
      "saving",
      "ready",
    ]);
  });
});
