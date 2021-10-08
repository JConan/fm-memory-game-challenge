import { GridSize } from "../hooks/useGameSetting";
import { generateTileValues } from "../libraries/Tools";

export type TyleState = "hidden" | "selected" | "paired";

export interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

export interface Tileset {
  getTiles: () => TileState[];
  selectTile: (props: { id: number }) => Promise<TileState[]>;
  checkSelected: () => Promise<TileState[]>;
  isAllTilesPaired: () => boolean;
}

export interface TilesetProps {
  gridSize: GridSize;
}

export class Tileset {
  private tiles: TileState[];

  constructor({ gridSize }: TilesetProps) {
    this.tiles = generateTileValues({ gridSize }).map(
      (value, id) => ({ id, value, state: "hidden" } as TileState)
    );

    this.getTiles = () => this.tiles.map((tile) => ({ ...tile }));

    this.selectTile = async ({ id }) => {
      const selectIds = this.getSelectedTiles().map(({ id }) => id);

      if (!selectIds.includes(id) && selectIds.length < 2) {
        this.tiles.forEach(
          (tile) => tile.id === id && (tile.state = "selected")
        );
      }
      return this.getTiles();
    };

    this.checkSelected = async () => {
      const selectedTiles = this.getSelectedTiles();
      if (selectedTiles.length === 2) {
        const state =
          selectedTiles[0].value === selectedTiles[1].value
            ? "paired"
            : "hidden";

        const ids = selectedTiles.map(({ id }) => id);
        this.tiles.forEach(
          (tile) => ids.includes(tile.id) && (tile.state = state)
        );
      }
      return this.getTiles();
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
