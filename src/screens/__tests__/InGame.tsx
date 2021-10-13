import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Setting, useGameSetting } from "../../hooks/useGameSetting";
import { act } from "react-dom/test-utils";
import { InGame } from "../InGame";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Location } from "history";
import * as Generator from "../../libraries/Tools/generateTileValues";
import { TILES_RESOLUTION_DELAY } from "../../hooks/useTilesetHandler";

describe("solo game small screen", () => {
  let location: Location | undefined = undefined;

  const WrappedSoloGame = (settings: Partial<Setting>) => {
    const gameSetting = useGameSetting();

    const Game = () => {
      location = useLocation();
      return (
        <InGame
          setting={{
            ...gameSetting,
            value: { ...gameSetting.value, ...settings },
          }}
        />
      );
    };

    return (
      <MemoryRouter initialEntries={["/game/solo"]}>
        <Game />
      </MemoryRouter>
    );
  };

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
  afterEach(() => {
    jest.useRealTimers();
    // make tiles to be generated in order
    jest.spyOn(Generator, "generateTileValues").mockRestore();
  });

  it("should have build layout for 4x4 grid", () => {
    render(<WrappedSoloGame />);
    screen.getByText(/memory/i);
    screen.getByRole("button", { name: /menu/i });
    screen.getByRole("list", { name: /memory item list/i });
    expect(
      screen.getAllByRole("listitem", { name: /memory item/i })
    ).toHaveLength(4 * 4);
    screen.getByRole("timer", { name: /time/i });
    screen.getByRole("status", { name: /moves/i });
  });

  it("should have build layout for 6x6 grid", () => {
    render(<WrappedSoloGame gridSize="6x6" />);
    expect(
      screen.getAllByRole("listitem", { name: /memory item/i })
    ).toHaveLength(6 * 6);
  });

  it("should have a moves counter that goes up after each tiles selections", () => {
    render(<WrappedSoloGame />);
    const tiles = screen.getAllByRole("listitem", { name: /memory item/i });

    expect(screen.getByRole("status", { name: "moves" })).toHaveTextContent(
      "Moves0"
    );

    act(() => {
      userEvent.click(tiles[0]);
    });

    expect(screen.getByRole("status", { name: "moves" })).toHaveTextContent(
      "Moves1"
    );
  });

  it("should show and close Menu when clicked outside", () => {
    render(<WrappedSoloGame />);
    const btnMenu = screen.getByRole("button", { name: /menu/i });
    expect(screen.queryByRole("dialog")).toBeNull();

    userEvent.click(btnMenu);

    const dialogBox = screen.getByRole("dialog");
    userEvent.click(dialogBox);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("should show and close menu after resume button is clicked", () => {
    render(<WrappedSoloGame />);

    userEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.queryByRole("dialog")).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should go back to the settings screen after clicked on new game button from menu", () => {
    render(<WrappedSoloGame />);
    expect(location?.pathname).toBe("/game/solo");

    userEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.queryByRole("dialog")).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /new game/i }));
    expect(location?.pathname).toBe("/");
  });

  it("should reset the game after clicked on the restart button from menu", () => {
    render(<WrappedSoloGame />);

    // make some moves and advance time
    const tiles = screen.getAllByRole("listitem", { name: /memory item/i });

    userEvent.click(tiles[0]);
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByRole("status", { name: /moves/i })).toHaveTextContent(
      /moves1/i
    );
    expect(screen.getByRole("timer", { name: /time/i })).toHaveTextContent(
      "Time0:10"
    );
    expect(tiles[0]).toHaveClass("tile-selected");

    // go to menu & restart
    userEvent.click(screen.getByRole("button", { name: /menu/i }));
    act(() => {
      userEvent.click(screen.getByRole("button", { name: /restart/i }));
    });

    expect(screen.getByRole("status", { name: /moves/i })).toHaveTextContent(
      /moves0/i
    );
    expect(screen.getByRole("timer", { name: /time/i })).toHaveTextContent(
      "Time0:00"
    );

    screen.getAllByRole("listitem").forEach((tile) => {
      expect(tile).toHaveClass("tile-hidden");
    });
  });

  it("should not increment the timer when displaying Menu and resume when closed", () => {
    render(<WrappedSoloGame />);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByRole("timer", { name: /time/i })).toHaveTextContent(
      "Time0:10"
    );
    userEvent.click(screen.getByRole("button", { name: /menu/i }));

    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByRole("timer", { name: /time/i })).toHaveTextContent(
      "Time0:10"
    );

    userEvent.click(screen.getByRole("dialog"));
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByRole("timer", { name: /time/i })).toHaveTextContent(
      "Time0:20"
    );
  });

  it("should count moves only for hidden tiles", () => {
    render(<WrappedSoloGame />);

    const tiles = screen.getAllByRole("listitem", { name: /memory item/i });

    act(() => {
      userEvent.click(tiles[0]);
    });
    expect(screen.getByRole("status", { name: "moves" })).toHaveTextContent(
      "Moves1"
    );

    act(() => {
      userEvent.click(tiles[0]);
    });
    expect(screen.getByRole("status", { name: "moves" })).toHaveTextContent(
      "Moves1"
    );
  });

  it("should have winning screen", () => {
    render(<WrappedSoloGame />);

    userPlayTileIndexes(
      ...Array(16)
        .fill(0)
        .map((_, i) => i)
    );

    expect(screen.getByText(/you did it/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restart/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new game/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Time Elapsed")).toHaveValue("0:10");
    expect(screen.getByLabelText("Moves Taken")).toHaveValue("16 Moves");
  });

  it("should how player turn in multiplayer session", () => {
    render(<WrappedSoloGame numberOfPlayers={4} />);
    expect(getActivePlayer()).toBe(1);
  });

  it("should have player turn reflected in players status", () => {
    render(<WrappedSoloGame numberOfPlayers={4} />);
    userPlayTileIndexes(0, 2);
    expect(countPairedTiles()).toBe(0);
    expect(getActivePlayer()).toBe(2);
  });

  it("should active player keep playing after a paired of tiles", () => {
    render(<WrappedSoloGame numberOfPlayers={4} />);
    userPlayTileIndexes(0, 1);
    expect(countPairedTiles()).toBe(1);
    expect(getActivePlayer()).toBe(1);
  });

  it("should player's score is increase after a paired tiles", () => {
    render(<WrappedSoloGame numberOfPlayers={4} />);

    const playerStatus = screen.getByRole("status", { name: /player 1/i });

    userPlayTileIndexes(0, 1);
    expect(playerStatus).toHaveTextContent("Player 11");
  });

  it("should correctly reset players scores and turn", () => {
    render(<WrappedSoloGame numberOfPlayers={4} />);
    userPlayTileIndexes(0, 1);

    userEvent.click(screen.getByRole("button", { name: /menu/i }));
    userEvent.click(screen.getByRole("button", { name: /restart/i }));

    const playerStatus = screen.getByRole("status", { name: /player 1/i });
    expect(playerStatus).toHaveTextContent("Player 10");
  });
});

/**
 * Simulate user selected tiles with tiles resolution after each moves
 * @param indexes list of tiles id
 */
const userPlayTileIndexes = (...indexes: number[]) => {
  const tiles = screen.getAllByRole("listitem", { name: /memory item/i });
  indexes.forEach((i) => {
    act(() => {
      userEvent.click(tiles[i]);
    });
    act(() => {
      jest.advanceTimersByTime(TILES_RESOLUTION_DELAY);
    });
  });
};

/**
 * get from screen active player (1 to 4)
 * @returns number
 */
const getActivePlayer = () => {
  const players = screen.getAllByRole("status", { name: /player/i });

  for (const [id, player] of players.entries()) {
    if (player.classList.contains("player-active")) return id + 1;
  }
};

/**
 * Count the number of paired tiles
 * @returns number
 */
const countPairedTiles = () => {
  const tiles = screen.getAllByRole("listitem", { name: /memory item/i });
  return (
    tiles.filter((tile) => tile.classList.contains("tile-paired")).length / 2
  );
};
