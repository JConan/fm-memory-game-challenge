import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { TileState, useGameCore } from "./GameCore";

describe("hook for GameCore", () => {
  const initGameCoreHook = () => {
    return renderHook(() =>
      useGameCore({
        gridSize: "4x4",
        numberOfPlayer: "1",
        theme: "Icons",
        tilesResolutionDelay: 100,
      })
    );
  };

  const getUniqueTiles = (tiles: TileState[]) =>
    tiles.filter(
      (tile, idx) =>
        tiles.findIndex(({ value }) => value === tile.value) === idx
    );

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should have a initial state", () => {
    const { result } = initGameCoreHook();
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.tiles).toBeInstanceOf(Array);
    expect(result.current.tiles).toHaveLength(16);
  });

  it("should be able to select a tile", async () => {
    const { result } = initGameCoreHook();

    const tile = result.current.tiles[0];
    expect(tile.state).toBe("hidden");
    await act(async () => {
      result.current.onSelectTile({ id: tile.id });
    });

    expect(result.current.tiles[0].id).toBe(tile.id);
    expect(result.current.tiles[0].state).toBe("selected");
  });

  it("should be able to select a pair of tiles", async () => {
    const { result } = initGameCoreHook();

    // select two different tiles
    const firstTile = () => getUniqueTiles(result.current.tiles)[0];
    const secondTile = () => getUniqueTiles(result.current.tiles)[1];

    act(() => {
      result.current.onSelectTile({ id: firstTile().id });
    });
    expect(firstTile().state).toEqual("selected");
    expect(secondTile().state).toEqual("hidden");

    act(() => {
      result.current.onSelectTile({ id: secondTile().id });
    });
    expect(firstTile().state).toEqual("selected");
    expect(secondTile().state).toEqual("selected");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(firstTile().state).toEqual("hidden");
    expect(secondTile().state).toEqual("hidden");
  });

  it("should be able to pair a set of tiles", async () => {
    const { result, waitForNextUpdate } = initGameCoreHook();

    const pairOfTIle = () =>
      result.current.tiles.filter((tile) => tile.value === 7);
    expect(pairOfTIle()).toHaveLength(2);

    await act(async () => {
      result.current.onSelectTile({ id: pairOfTIle()[0].id });
      await waitForNextUpdate();
      result.current.onSelectTile({ id: pairOfTIle()[1].id });
    });

    expect(pairOfTIle()[0].state).toBe("selected");
    expect(pairOfTIle()[1].state).toBe("selected");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(pairOfTIle()[0].state).toBe("paired");
    expect(pairOfTIle()[1].state).toBe("paired");
  });
});
