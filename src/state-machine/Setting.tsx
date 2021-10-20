import store from "store2";
import {
  createMachine,
  assign,
  DoneInvokeEvent,
  MachineConfig,
  MachineOptions,
} from "xstate";

export interface SettingContext {
  gridSize?: "4x4" | "6x6";
  numberOfPlayer?: 1 | 2 | 3 | 4;
  theme?: "Numbers" | "Icons";
}

export type SettingEvents =
  | { type: "UPDATE_SETTING"; data: SettingContext }
  | { type: "SAVE_SETTING" };

export const SettingDefinition: MachineConfig<
  SettingContext,
  any,
  SettingEvents
> = {
  id: "setting",
  initial: "created",
  context: {
    gridSize: "4x4",
    numberOfPlayer: 1,
    theme: "Numbers",
  },
  states: {
    created: {
      always: {
        target: "loading",
      },
    },
    loading: {
      invoke: {
        src: "loadSetting",
        onDone: {
          target: "ready",
          actions: "updateSetting",
        },
      },
    },
    saving: {
      invoke: {
        src: "saveSetting",
        onDone: {
          target: "ready",
        },
      },
    },
    ready: {
      on: {
        UPDATE_SETTING: {
          actions: "updateSetting",
        },
        SAVE_SETTING: "saving",
      },
    },
  },
};

export const SettingOptions: Partial<
  MachineOptions<SettingContext, SettingEvents>
> = {
  actions: {
    updateSetting: assign((_, event) => (event as any).data),
  },
  services: {
    saveSetting: async (context) => store.set("gameSetting", context),
    loadSetting: async () => store.get("gameSetting"),
  },
};

export const SettingMachine = createMachine(SettingDefinition, SettingOptions);
