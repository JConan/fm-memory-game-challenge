import { GameGridSize } from "hooks/GameConfig";
import { generateTileValues } from "libraries/Tools";

export type TyleState = "hidden" | "selected" | "paired";

export interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

export interface Tileset {
  getTiles: () => TileState[];
  selectTile: (props: { id: number }) => boolean;
  checkSelected: () => boolean;
  isAllTilesPaired: () => boolean;
}

export interface TilesetProps {
  gridSize: GameGridSize;
}

export class Tileset {
  private tiles: TileState[];

  constructor({ gridSize }: TilesetProps) {
    this.tiles = generateTileValues({ gridSize }).map(
      (value, id) => ({ id, value, state: "hidden" } as TileState)
    );

    this.getTiles = () => this.tiles.map((tile) => ({ ...tile }));

    this.selectTile = ({ id }) => {
      const selectIds = this.getSelectedTiles().map(({ id }) => id);

      if (!selectIds.includes(id) && selectIds.length < 2) {
        this.tiles = this.tiles.map((tile) =>
          tile.id === id ? { ...tile, state: "selected" } : tile
        );
        return true;
      }
      return false;
    };

    this.checkSelected = () => {
      const selectedTiles = this.getSelectedTiles();
      if (selectedTiles.length === 2) {
        const state =
          selectedTiles[0].value === selectedTiles[1].value
            ? "paired"
            : "hidden";

        const ids = selectedTiles.map(({ id }) => id);
        this.tiles = this.tiles.map((tile) =>
          ids.includes(tile.id) ? { ...tile, state } : tile
        );
        return true;
      }
      return false;
    };

    this.isAllTilesPaired = () =>
      gridSize === "4x4"
        ? this.getPairedTiles().length === 16
        : this.getPairedTiles().length === 32;
  }

  private getPairedTiles = () =>
    this.getTiles().filter((tile) => tile.state === "paired");
  private getSelectedTiles = () =>
    this.getTiles().filter((tile) => tile.state === "selected");
}

export type { GameGridSize } from "hooks/GameConfig";
