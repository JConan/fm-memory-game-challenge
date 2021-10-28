import { Chance } from "chance";
import { assign, createMachine, MachineConfig, MachineOptions } from "xstate";
import { SettingContext } from "./Setting";

export interface Tile {
  id: number;
  value: number;
  state: "hidden" | "selected" | "paired";
}

export interface GridContext {
  setting?: Pick<SettingContext, "gridSize">;
  tiles: Tile[];
  selectedTiles: [Tile?, Tile?];
}

export type GridEvents =
  | {
      type: "SET_SETTING";
      setting: Pick<SettingContext, "gridSize">;
    }
  | { type: "SELECT_TILE"; tile: Pick<Tile, "id"> }
  | { type: "RESOLVE_TILES" };

export const GridDefinition: MachineConfig<GridContext, any, GridEvents> = {
  id: "grid",
  initial: "created",
  context: {
    tiles: [],
    selectedTiles: [],
  },
  states: {
    created: {
      on: {
        SET_SETTING: {
          target: "generating",
          actions: assign({ setting: (_, event) => event.setting }),
        },
      },
    },
    generating: {
      entry: "generateTiles",
      always: {
        target: "ready",
      },
    },
    ready: {
      on: {
        SELECT_TILE: {
          cond: (context, event) =>
            context.selectedTiles.find((tile) => tile?.id === event.tile.id) ===
            undefined,
          target: "checkingSelection",
          actions: "doSelectTile",
        },
      },
    },
    checkingSelection: {
      always: [
        {
          cond: "twoSelectedTiles",
          target: "resolvingSelection",
        },
        {
          target: "ready",
        },
      ],
    },
    resolvingSelection: {
      after: {
        650: {
          target: "checkGameOver",
        },
      },
      exit: "resolveSelection",
    },
    checkGameOver: {
      always: [{ target: "gameOver", cond: "isGameOver" }, { target: "ready" }],
    },
    gameOver: {
      type: "final",
    },
  },
};

export const GridOptions: Partial<MachineOptions<GridContext, GridEvents>> = {
  actions: {
    generateTiles: assign((context) => {
      const numberOfPairs = context.setting?.gridSize === "4x4" ? 8 : 18;
      const shuffledPairValues = Chance().shuffle(
        Array(numberOfPairs)
          .fill(0)
          .map((_, i) => [i, i])
          .flatMap((x) => x)
      );
      const tiles = shuffledPairValues.map(
        (value, id) =>
          ({
            id,
            value,
            state: "hidden",
          } as Tile)
      );
      return { tiles };
    }),
    doSelectTile: assign((context, event) => {
      if (event.type === "SELECT_TILE") {
        const tiles = context.tiles.map((tile) =>
          tile.state === "hidden" && tile.id === event.tile.id
            ? ({ ...tile, state: "selected" } as Tile)
            : tile
        );
        const selectedTiles = tiles.filter((tile) => tile.state === "selected");
        return {
          tiles,
          selectedTiles,
        } as GridContext;
      }
      return {};
    }),
    resolveSelection: assign((context) => {
      const selectedIds = context.selectedTiles.map((tile) => tile?.id);
      const [tileA, tileB] = context.selectedTiles;
      const newState: "paired" | "hidden" =
        tileA?.value === tileB?.value ? "paired" : "hidden";

      return {
        selectedTiles: [],
        tiles: context.tiles.map((tile, idx) =>
          selectedIds.includes(tile.id)
            ? ({ ...tile, state: newState } as Tile)
            : tile
        ),
      };
    }),
  },
  services: {},
  guards: {
    twoSelectedTiles: (context) => context.selectedTiles.length === 2,
    isGameOver: (context) => {
      const result = context.tiles
        .map(({ state }) => state)
        .reduce(
          (counters, tileState) => ({
            ...counters,
            [tileState]: counters[tileState] + 1,
          }),
          {
            hidden: 0,
            paired: 0,
            selected: 0,
          }
        );
      return result.hidden + result.selected === 0;
    },
  },
};

export const GridMachine = createMachine(GridDefinition, GridOptions);
