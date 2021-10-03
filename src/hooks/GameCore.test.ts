import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { useGameCore } from "./GameCore";

describe("hook for GameCore", () => {
  const initGameCoreHook = () => {
    return renderHook(() =>
      useGameCore({
        gridSize: "4x4",
        numberOfPlayer: "1",
        theme: "Icons",
      })
    );
  };

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

  it("should be able to pair a set of tiles", async () => {
    const { result, waitForNextUpdate } = initGameCoreHook();

    const pairOfTIle = result.current.tiles.filter((tile) => tile.value === 7);
    expect(pairOfTIle).toHaveLength(2);

    await act(async () => {
      result.current.onSelectTile({ id: pairOfTIle[0].id });
      await waitForNextUpdate();
      result.current.onSelectTile({ id: pairOfTIle[1].id });
    });

    const pairOfTIleUpdated = result.current.tiles.filter(
      (tile) => tile.value === 7
    );
    expect(pairOfTIleUpdated[0].state).toBe("paired");
    expect(pairOfTIleUpdated[1].state).toBe("paired");
  });

  it("should be able to hide back wrong pair", async () => {
    const { result, waitForNextUpdate } = initGameCoreHook();

    const pairOfTIle = result.current.tiles.filter((tile) => tile.value === 7);
    const otherPairOfTIle = result.current.tiles.filter(
      (tile) => tile.value === 1
    );
    expect(pairOfTIle).toHaveLength(2);

    await act(async () => {
      result.current.onSelectTile({ id: pairOfTIle[0].id });
      await waitForNextUpdate();
      result.current.onSelectTile({ id: otherPairOfTIle[1].id });
    });

    const pairOfTIleUpdated = result.current.tiles.filter(
      (tile) => tile.value === 7
    );
    expect(pairOfTIleUpdated[0].state).toBe("hidden");
    expect(pairOfTIleUpdated[1].state).toBe("hidden");
  });
});
