import { Tileset } from "./Tileset";

describe("Class Tileset for managin tiles in the memory game", () => {
  it("should be initialized by grid size", () => {
    const tileset = new Tileset({ gridSize: "4x4" });
    expect(tileset.getTiles()).toHaveLength(16);
  });

  it("should be not be able to select more than 2 tiles", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    expect(tileset.selectTile({ id: tileset.getTiles()[0].id })).toBe(true);
    expect(tileset.selectTile({ id: tileset.getTiles()[1].id })).toBe(true);
    expect(tileset.selectTile({ id: tileset.getTiles()[2].id })).toBe(false);
  });

  it("should be not be able to select the same tile", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    expect(tileset.selectTile({ id: tileset.getTiles()[0].id })).toBe(true);
    expect(tileset.selectTile({ id: tileset.getTiles()[0].id })).toBe(false);
  });

  it("should be able to resolve all paired tiles and end the game", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    const sortedTiles = tileset.getTiles().sort((a, b) => a.value - b.value);
    const getTileById = (id: number) => {
      return tileset.getTiles().find((tile) => tile.id === id);
    };

    for (let i = 0; i < sortedTiles.length; i += 2) {
      tileset.selectTile({ id: sortedTiles[i].id });
      tileset.selectTile({ id: sortedTiles[i + 1].id });
      expect(getTileById(sortedTiles[i].id)?.state).toBe("selected");
      expect(getTileById(sortedTiles[i + 1].id)?.state).toBe("selected");

      expect(tileset.checkSelected()).toBe(true);
      expect(getTileById(sortedTiles[i].id)?.state).toBe("paired");
      expect(getTileById(sortedTiles[i].id)?.state).toBe("paired");
    }

    expect(tileset.isAllTilesPaired()).toEqual(true);
  });

  it("should be able to resolve wrong selected tiles", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    const sortedTiles = tileset.getTiles().sort((a, b) => a.value - b.value);
    const getTileById = (id: number) => {
      return tileset.getTiles().find((tile) => tile.id === id);
    };

    tileset.selectTile({ id: sortedTiles[0].id });
    tileset.selectTile({ id: sortedTiles[2].id });

    expect(getTileById(sortedTiles[0].id)?.state).toBe("selected");
    expect(getTileById(sortedTiles[2].id)?.state).toBe("selected");

    expect(tileset.checkSelected()).toBe(true);

    expect(getTileById(sortedTiles[0].id)?.state).toBe("hidden");
    expect(getTileById(sortedTiles[2].id)?.state).toBe("hidden");
  });
});
