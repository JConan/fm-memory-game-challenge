import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { Tile } from "../useGameCore";
import {
  TILES_RESOLUTION_DELAY,
  useTilesetHandler,
} from "../useTilesetHandler";

describe("useTiles for managing tileset", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("should be able to initialize 4x4 tiles", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    expect(result.current).toHaveProperty("tiles");
    expect(result.current.tiles).toBeInstanceOf(Array);
    expect(result.current.tiles).toHaveLength(16);
  });

  it("should be able to initialize 6x6 tiles", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "6x6" }));

    expect(result.current).toHaveProperty("tiles");
    expect(result.current.tiles).toBeInstanceOf(Array);
    expect(result.current.tiles).toHaveLength(36);
  });

  it("should be able to reset tiles", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));
    const firstTiles = [...result.current.tiles];

    act(() => {
      result.current.reset();
    });
    expect(result.current.tiles).not.toEqual(firstTiles);
  });

  it("should be able to selected a tiles", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    act(() => {
      result.current.select({ id: result.current.tiles[0].id });
    });

    expect(result.current.tiles[0].state).toBe("selected");
  });

  it("should be able to selected at most 2 tiles", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    // select first 2 tiles
    result.current.tiles.slice(0, 2).forEach(({ id }) => {
      act(() => {
        result.current.select({ id });
      });
      expect(findOneBy(result.current.tiles, { id }).state).toBe("selected");
    });

    // third selection should not be possible
    const thirdTile = result.current.tiles[2];
    act(() => {
      result.current.select({ id: thirdTile.id });
    });
    expect(findOneBy(result.current.tiles, { id: thirdTile.id }).state).toBe(
      "hidden"
    );
  });

  it("should be able to resolve selected to paired when tile is matched", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    const sortedTiles = result.current.tiles.sort((a, b) => a.value - b.value);

    // selection 2 tiles
    sortedTiles.slice(0, 2).forEach(({ id }) => {
      act(() => {
        result.current.select({ id });
      });
      expect(findOneBy(result.current.tiles, { id }).state).toBe("selected");
    });

    // advance time for resolving tiles
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
    });
    sortedTiles.slice(0, 2).forEach(({ id }) => {
      expect(findOneBy(result.current.tiles, { id }).state).toBe("paired");
    });
  });

  it("should be able to resolve selected to hidden when tile is not matched", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    const sortedTiles = result.current.tiles.sort((a, b) => a.value - b.value);
    const unmatchTiles = [sortedTiles[0], sortedTiles[2]];

    // selection 2 tiles
    unmatchTiles.forEach(({ id }) => {
      act(() => {
        result.current.select({ id });
      });
      expect(findOneBy(result.current.tiles, { id }).state).toBe("selected");
    });

    // advance time for resolving tiles
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
    });
    unmatchTiles.forEach(({ id }) => {
      expect(findOneBy(result.current.tiles, { id }).state).toBe("hidden");
    });
  });

  it("should be able select a paired tile", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));

    const sortedTiles = result.current.tiles.sort((a, b) => a.value - b.value);

    // selection 2 tiles
    sortedTiles.slice(0, 2).forEach(({ id }) => {
      act(() => {
        result.current.select({ id });
      });
    });

    // advance time for resolving tiles
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
      result.current.select({ id: sortedTiles[0].id });
    });

    expect(
      findOneBy(result.current.tiles, { id: sortedTiles[0].id }).state
    ).toBe("paired");
  });
});

const findAllBy = (tiles: Tile[], filter: Partial<Tile>) => {
  return tiles.filter((tile) => match(tile, filter));
};

const findOneBy = (tiles: Tile[], filter: Partial<Tile>) => {
  for (const tile of tiles) {
    if (match(tile, filter)) return tile;
  }
};

const match = <T extends Object>(a: T, b: Partial<T>): boolean =>
  !Object.keys(b)
    .map((k) => a[k] === b[k])
    .includes(false);
