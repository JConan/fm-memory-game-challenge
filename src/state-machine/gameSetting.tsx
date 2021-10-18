import { useMachine } from "@xstate/react";
import store from "store2";
import { createMachine, assign, DoneInvokeEvent } from "xstate";

export interface GameSetting {
  gridSize?: "4x4" | "6x6";
  numberOfPlayer?: 1 | 2 | 3 | 4;
  theme?: "Numbers" | "Icons";
}

export const defaultSetting: GameSetting = {
  gridSize: "4x4",
  numberOfPlayer: 1,
  theme: "Numbers",
};

export type SettingEvents = { type: "UPDATE_SETTING"; setting: GameSetting };

// const loadFromLocalStore = async (): Promise<GameSetting> =>
//   store.get("gameSetting");

export const gameSettingMachine = createMachine<GameSetting, SettingEvents>(
  {
    id: "game-setting",
    initial: "init",
    context: {},
    states: {
      init: {
        invoke: {
          id: "load-setting",
          src: "loadFromLocalStore",
          onDone: [
            {
              target: "ready",
              cond: (_, event) => event.data !== null,
              actions: assign<GameSetting, DoneInvokeEvent<GameSetting>>(
                (context, event) => ({
                  ...context,
                  ...event.data,
                })
              ),
            },
            {
              target: "ready",
              actions: assign<GameSetting, DoneInvokeEvent<GameSetting>>({
                gridSize: "4x4",
                numberOfPlayer: 1,
                theme: "Numbers",
              }),
            },
          ],
        },
      },
      ready: {
        on: {
          UPDATE_SETTING: {
            actions: assign((_, event) => event.setting),
          },
        },
      },
    },
  },
  {
    actions: {},
    guards: {},
    services: {
      loadFromLocalStore: async () => store.get("gameSetting") as GameSetting,
    },
  }
);
