import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameSettings, useGameConfig } from "hooks/GameConfig";
import { act } from "react-dom/test-utils";
import { SoloGame } from "./SoloGame";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Location } from "history";

describe("solo game small screen", () => {
  let location: Location | undefined = undefined;

  const WrappedSoloGame = (settings: Partial<GameSettings>) => {
    const state = useGameConfig();

    const Game = () => {
      location = useLocation();
      return <SoloGame setting={{ ...state, ...settings }} />;
    };

    return (
      <MemoryRouter initialEntries={["/game/solo"]}>
        <Game />
      </MemoryRouter>
    );
  };

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
    jest.useFakeTimers();
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

    jest.useRealTimers();
  });
});
