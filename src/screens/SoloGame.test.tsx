import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameSettings, useGameConfig } from "hooks/GameConfig";
import { act } from "react-dom/test-utils";
import { SoloGame } from "./SoloGame";

describe("solo game small screen", () => {
  const WrappedSoloGame = (settings: Partial<GameSettings>) => {
    const state = useGameConfig();

    return <SoloGame setting={{ ...state, ...settings }} />;
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
});
