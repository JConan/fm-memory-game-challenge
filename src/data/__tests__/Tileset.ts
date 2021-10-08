import { Tileset } from "../Tileset";

describe("Class Tileset for managin tiles in the memory game", () => {
  it("should be initialized by grid size", () => {
    const tileset = new Tileset({ gridSize: "4x4" });
    expect(tileset.getTiles()).toHaveLength(16);
  });

  it("should be able to selected and update tileset", () => {
    const tileset = new Tileset({ gridSize: "4x4" });
    return tileset.selectTile({ id: 0 }).then((tiles) => {
      const targetTile = tiles.find((tile) => tile.id === 0);
      expect(targetTile?.state).toBe("selected");
    });
  });

  it("should be not be able to select more than 2 tiles", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    for (let id = 0, l = tileset.getTiles().length; id < l; id++) {
      tileset.selectTile({ id });
    }

    expect(
      tileset.getTiles().filter((tile) => tile.state === "selected")
    ).toHaveLength(2);
  });

  it("should be able to resolve all paired tiles and end the game", async () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    const sortedTiles = tileset.getTiles().sort((a, b) => a.value - b.value);
    const getTileById = (id: number) => {
      return tileset.getTiles().find((tile) => tile.id === id);
    };

    for (let i = 0; i < sortedTiles.length; i += 2) {
      const tileIds = [sortedTiles[i].id, sortedTiles[i + 1].id];

      tileset.selectTile({ id: tileIds[0] });
      tileset.selectTile({ id: tileIds[1] });
      expect(getTileById(tileIds[0])?.state).toBe("selected");
      expect(getTileById(tileIds[1])?.state).toBe("selected");

      const updatedTiles = (await tileset.checkSelected()).filter((tile) =>
        tileIds.includes(tile.id)
      );

      expect(updatedTiles[0]?.state).toBe("paired");
      expect(updatedTiles[1]?.state).toBe("paired");
    }

    expect(tileset.isAllTilesPaired()).toEqual(true);
  });

  it("should be able to resolve wrong selected tiles", () => {
    const tileset = new Tileset({ gridSize: "4x4" });

    const sortedTiles = tileset.getTiles().sort((a, b) => a.value - b.value);
    const getTileById = (id: number) => {
      return tileset.getTiles().find((tile) => tile.id === id);
    };

    const tilesIds = [sortedTiles[0].id, sortedTiles[2].id];

    tilesIds.forEach((id) => {
      tileset.selectTile({ id });
      expect(getTileById(id)?.state).toBe("selected");
    });

    tileset.checkSelected();

    tilesIds.forEach((id) => {
      expect(getTileById(id)?.state).toBe("hidden");
    });
  });
});
