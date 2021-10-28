import { SettingMachine, SettingContext, SettingEvents } from "../Setting";
import { InterpretWithSimulation } from "../helpers";
import store from "store2";
import assert from "assert";

describe("Game setting state machine", () => {
  const defaultSetting = {
    gridSize: "4x4",
    numberOfPlayer: 1,
    theme: "Numbers",
  };
  const fakeGetStore = jest.spyOn(store, "get");
  const fakeSetStore = jest.spyOn(store, "set");

  const createSettingMachine = (mockSetting?: SettingContext) => {
    fakeGetStore.mockReturnValueOnce(mockSetting ?? null);
    return InterpretWithSimulation(SettingMachine);
  };

  afterAll(() => {
    fakeGetStore.mockRestore();
    fakeSetStore.mockRestore();
  });

  it("should load default setting when no data is store in local", async () => {
    const { getChangedStates, waitUntil } = createSettingMachine();

    const state = await waitUntil((state) => state.matches("ready"));
    assert(state, "expected state not to be null");

    expect(fakeGetStore).toBeCalledTimes(1);
    expect(state.context).toEqual(defaultSetting);
    expect(getChangedStates()).toEqual(["created", "loading", "ready"]);
  });

  it("should able to retrieve setting from local storage", async () => {
    const customSetting: SettingContext = {
      gridSize: "6x6",
      numberOfPlayer: 4,
      theme: "Icons",
    };

    const { getChangedStates, waitUntil } = createSettingMachine(customSetting);

    const state = await waitUntil((state) => state.matches("ready"));
    assert(state, "expected state not to be null");

    expect(fakeGetStore).toBeCalledTimes(1);
    expect(state.context).toEqual(customSetting);
    expect(getChangedStates()).toEqual(["created", "loading", "ready"]);
  });

  it("should be able to update setting", async () => {
    const { send, getChangedStates, waitUntil } = createSettingMachine();
    await waitUntil((state) => state.matches("ready"));
    send({ type: "UPDATE_SETTING", data: { gridSize: "6x6" } });

    const state = await waitUntil(
      (state, event) =>
        event.type === "UPDATE_SETTING" && state.matches("ready")
    );
    assert(state, "expected state not to be null");

    expect(state.context).toHaveProperty("gridSize", "6x6");
    expect(getChangedStates()).toEqual([
      "created",
      "loading",
      "ready",
      "ready",
    ]);
  });

  it("should be able to update multiple setting", async () => {
    const newSetting: SettingContext = { gridSize: "6x6", theme: "Icons" };
    const { send, waitUntil } = createSettingMachine();
    await waitUntil((state) => state.matches("ready"));

    send({ type: "UPDATE_SETTING", data: newSetting });
    const state = await waitUntil(
      (state, event) =>
        event.type === "UPDATE_SETTING" && state.matches("ready")
    );
    assert(state, "expected state not to be null");

    expect(state.context).toMatchObject(newSetting);
  });

  it("should be able to save setting to local storage", async () => {
    const { send, getChangedStates, waitUntil } = createSettingMachine();
    await waitUntil((state) => state.matches("ready"));

    send({ type: "SAVE_SETTING" });

    await waitUntil(
      (state, event) =>
        event.type === "UPDATE_SETTING" && state.matches("ready")
    );

    expect(fakeSetStore).toBeCalledTimes(1);
    expect(getChangedStates()).toEqual([
      "created",
      "loading",
      "ready",
      "saving",
      "ready",
    ]);
  });
});
