import { renderHook, RenderResult } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { Tile } from "../useGameCore";
import {
  TilesetHandler,
  TILES_RESOLUTION_DELAY,
  useTilesetHandler,
} from "../useTilesetHandler";
import * as Generator from "../../libraries/Tools/generateTileValues";

describe("useTiles for managing tileset", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // make tiles to be generated in order
    jest
      .spyOn(Generator, "generateTileValues")
      .mockImplementationOnce(({ gridSize }) =>
        Array(gridSize === "4x4" ? 8 : 18)
          .fill(0)
          .map((_, i) => [i, i])
          .flatMap((x) => x)
      );
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
    jest.restoreAllMocks();
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));
    const firstTiles = [...result.current.tiles];

    act(() => {
      result.current.reset();
    });
    expect(result.current.tiles).not.toEqual(firstTiles);
  });

  it("should be able to selected a tiles", () => {
    const { result: handler } = renderHook(() =>
      useTilesetHandler({ gridSize: "4x4" })
    );
    selectTiles(handler, 0);
    expect(handler.current.tiles[0].state).toBe("selected");
  });

  it("should be able to selected at most 2 tiles", () => {
    const { result: handler } = renderHook(() =>
      useTilesetHandler({ gridSize: "4x4" })
    );

    // select first 2 tiles
    const selectTileOnId = handleTileSelection(handler, false);
    handler.current.tiles
      .slice(0, 2)
      .map(({ id }) => id)
      .forEach(selectTileOnId);

    // third selection should not be possible
    const thirdTile = handler.current.tiles[2];
    selectTileOnId(thirdTile.id);
    expect(findOneBy(handler.current.tiles, { id: thirdTile.id })?.state).toBe(
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
      expect(findOneBy(result.current.tiles, { id })?.state).toBe("selected");
    });

    // advance time for resolving tiles
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
    });
    sortedTiles.slice(0, 2).forEach(({ id }) => {
      expect(findOneBy(result.current.tiles, { id })?.state).toBe("paired");
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
      expect(findOneBy(result.current.tiles, { id })?.state).toBe("selected");
    });

    // advance time for resolving tiles
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
    });
    unmatchTiles.forEach(({ id }) => {
      expect(findOneBy(result.current.tiles, { id })?.state).toBe("hidden");
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
      findOneBy(result.current.tiles, { id: sortedTiles[0].id })?.state
    ).toBe("paired");
  });

  it("should have a paired remain counter for 4x4 gridSize", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "4x4" }));
    expect(result.current.remainPair).toBe(8);
  });

  it("should have a paired remain counter for 6x6 gridSize", () => {
    const { result } = renderHook(() => useTilesetHandler({ gridSize: "6x6" }));
    expect(result.current.remainPair).toBe(18);
  });

  it("should update remain Paired counter after a valid selection if resolve", () => {
    const { result: handler } = renderHook(() =>
      useTilesetHandler({ gridSize: "6x6" })
    );

    selectTiles(handler, 0, 1);
    expect(handler.current.remainPair).toBe(17);

    for (let i = 2; i < 6 * 6; i++) {
      selectTiles(handler, i);
    }
    expect(handler.current.remainPair).toBe(0);
  });
});

const selectTiles = (
  handler: RenderResult<TilesetHandler>,
  ...indexes: number[]
) => {
  indexes.forEach(handleTileSelection(handler));
};

const handleTileSelection =
  (handler: RenderResult<TilesetHandler>, shouldAdvanceTimer: boolean = true) =>
  (id: number) => {
    act(() => {
      handler.current.select({ id });
    });
    shouldAdvanceTimer &&
      act(() => {
        jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
      });
  };

const findOneBy = (tiles: Tile[], filter: Partial<Tile>) => {
  for (const tile of tiles) {
    if (match(tile, filter)) return tile;
  }
};

const match = <T extends {}>(a: T, b: Partial<T>): boolean =>
  !Object.keys(b)
    .map((k) => a[k as keyof T] === b[k as keyof T])
    .includes(false);
