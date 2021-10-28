import { assign, State } from "xstate";
import { GridContext, GridMachine, Tile } from "../Grid";
import { InterpretWithSimulation } from "../helpers";

describe("Game grid state machine", () => {
  const gridContext: GridContext = {
    setting: { gridSize: "4x4" },
    selectedTiles: [],
    tiles: Array(8)
      .fill(0)
      .map((_, i) => [i, i])
      .flatMap((x) => x)
      .map(
        (value, id) =>
          ({
            id,
            value,
            state: "hidden",
          } as Tile)
      ),
  };
  const selectTiles = (context: GridContext, ...tiles: Pick<Tile, "id">[]) =>
    tiles.reduce(
      (prevState, tile) =>
        GridMachine.withContext(prevState.context || context).transition(
          "ready",
          {
            type: "SELECT_TILE",
            tile,
          }
        ) as State<GridContext>,
      {} as State<GridContext>
    );

  const RiggedMachine = GridMachine.withConfig({
    actions: {
      generateTiles: assign((context) => {
        const tiles = Array(8)
          .fill(0)
          .map((_, i) => [i, i])
          .flatMap((x) => x)
          .map(
            (value, id) =>
              ({
                id,
                value,
                state: "hidden",
              } as Tile)
          );
        return { tiles };
      }),
    },
  });

  const interpretGridMachine = () => {
    const { clock, service, send, getTransitions, getLastTransitions } =
      InterpretWithSimulation(RiggedMachine);

    expect(getLastTransitions().state.value).toBe("created");

    send(
      { type: "SET_SETTING", setting: { gridSize: "4x4" } } // transition to ready
    );
    expect(getLastTransitions().state.value).toBe("ready");
    return {
      getTransitions,
      getLastTransitions,
      clock,
      service,
      send,
    };
  };

  it.each([
    { gridSize: "4x4" as "4x4" | "6x6", length: 16 },
    { gridSize: "6x6" as "4x4" | "6x6", length: 36 },
  ])("should be able to generate tiles %j", ({ gridSize, length }) => {
    const { context } = GridMachine.transition("created", {
      type: "SET_SETTING",
      setting: {
        gridSize,
      },
    });
    expect(context.tiles).toHaveLength(length);
  });

  it("should able to select same tiles once", () => {
    let nextState = selectTiles(gridContext, { id: 0 });

    expect(nextState.changed).toBeTruthy();
    expect(nextState.context.tiles[0].state).toBe("selected");

    nextState = selectTiles(nextState.context, { id: 0 });
    expect(nextState.changed).toBeFalsy();
    expect(nextState.context.tiles[0].state).toBe("selected");
  });

  it("should be able to resolve paired of tiles", async () => {
    const { clock, send, getLastTransitions } = interpretGridMachine();

    send([
      { type: "SELECT_TILE", tile: { id: 0 } },
      { type: "SELECT_TILE", tile: { id: 1 } },
    ]);
    expect(getLastTransitions().state.value).toBe("resolvingSelection");

    clock.increment(650); // advance internal clock
    const { context, value } = getLastTransitions().state;
    expect(value).toBe("ready");
    expect(context.tiles.filter((tile) => tile.state === "paired")).toEqual([
      expect.objectContaining({ id: 0 }),
      expect.objectContaining({ id: 1 }),
    ]);
  });

  it("should be able to resolve unmatched paired of tiles", async () => {
    const { getLastTransitions, clock, service } = interpretGridMachine();

    service.send([
      { type: "SELECT_TILE", tile: { id: 0 } },
      { type: "SELECT_TILE", tile: { id: 2 } },
    ]);
    clock.increment(650);

    const { context, value } = getLastTransitions().state;
    expect(value).toBe("ready");
    expect(context.tiles.filter((tile) => tile.state === "paired")).toEqual([]);
  });
});
