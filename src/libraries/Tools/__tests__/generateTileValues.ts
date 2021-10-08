import { Chance } from "chance";
import { GridSize } from "hooks/useGameSetting";
import { generateTileValues } from "../generateTileValues";

describe("generate values used by the tiles in the memory games", () => {
  let mockedChance: jest.SpyInstance | undefined = undefined;
  afterEach(() => mockedChance && mockedChance.mockRestore());

  const MockedChance = ({ seed }: { seed: string }) => {
    const seededChance = Chance(seed);
    mockedChance = jest
      .spyOn(Chance, "Chance")
      .mockImplementation(() => seededChance);
  };

  it.each([
    {
      seed: "hello",
      gridSize: "4x4" as GridSize,
      expected: [7, 6, 5, 3, 7, 3, 4, 2, 4, 1, 0, 0, 2, 5, 6, 1],
    },
    {
      seed: "memory-challenge",
      gridSize: "6x6" as GridSize,
      expected: [
        13, 7, 9, 13, 16, 3, 5, 1, 16, 6, 5, 4, 8, 12, 15, 9, 2, 14, 17, 4, 0,
        0, 10, 7, 11, 10, 12, 14, 11, 17, 8, 15, 3, 1, 6, 2,
      ],
    },
    {
      seed: "frontendmentor.io",
      gridSize: "4x4" as GridSize,
      expected: [6, 4, 4, 0, 7, 2, 5, 0, 3, 2, 3, 1, 5, 7, 6, 1],
    },
  ])(
    "should generate values for game of 4x4 grid size",
    ({ seed, gridSize, expected }) => {
      MockedChance({ seed });
      let result = generateTileValues({ gridSize });
      expect(result).toEqual(expected);
    }
  );
});
