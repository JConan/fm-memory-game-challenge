import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Start } from "../Start";
import { useGameState, GameState } from "../../hooks/GameState";
import { useLocation, MemoryRouter } from "react-router";
import { Location } from "history";

describe("start game screen", () => {
  let gameState: GameState;
  let location: Location;

  const WrappedApp = () => {
    gameState = useGameState();
    location = useLocation();
    return <Start state={gameState} />;
  };

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/start"]}>
        <WrappedApp />
      </MemoryRouter>
    );
  });
  it("should have a title", () => {
    screen.getByText(/^memory$/i);
  });

  it("should be able to choose theme", () => {
    screen.getByText(/^select theme$/i);
    const btnNumbers = screen.getByRole("button", { name: /^numbers$/i });
    const btnIcons = screen.getByRole("button", { name: /^icons$/i });

    expect(gameState).toHaveProperty("theme", "Numbers");
    expect(btnNumbers).toHaveClass("button-active");
    expect(btnIcons).not.toHaveClass("button-active");

    userEvent.click(btnIcons);
    expect(gameState).toHaveProperty("theme", "Icons");
    expect(btnNumbers).not.toHaveClass("button-active");
    expect(btnIcons).toHaveClass("button-active");

    userEvent.click(btnNumbers);
    expect(gameState).toHaveProperty("theme", "Numbers");
  });

  it("should be able to choose grid size", () => {
    screen.getByText(/^Grid Size$/i);
    expect(gameState).toHaveProperty("gridSize", "4x4");

    const btn4x4 = screen.getByRole("button", { name: /^4x4$/i });
    const btn6x6 = screen.getByRole("button", { name: /^6x6$/i });

    userEvent.click(btn6x6);
    expect(gameState).toHaveProperty("gridSize", "6x6");
    expect(btn6x6).toHaveClass("button-active");
    expect(btn4x4).not.toHaveClass("button-active");

    userEvent.click(btn4x4);
    expect(gameState).toHaveProperty("gridSize", "4x4");
    expect(btn4x4).toHaveClass("button-active");
    expect(btn6x6).not.toHaveClass("button-active");
  });

  it("should be able to choose numbers of players", () => {
    screen.getByText(/^numbers of players$/i);
    const buttons = ["1", "2", "3", "4"].map((number) =>
      screen.getByRole("button", { name: number })
    );
    expect(buttons[0]).toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).not.toHaveClass("button-active");
    expect(buttons[3]).not.toHaveClass("button-active");

    userEvent.click(buttons[3]);
    expect(buttons[0]).not.toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).not.toHaveClass("button-active");
    expect(buttons[3]).toHaveClass("button-active");
  });

  it("should be able to start a game of size 4x4", () => {
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    userEvent.click(btnStart);
    expect(location.pathname).toBe("/game/solo/4x4");
  });

  it("should be able to start a game of size 4x4 multiplayer", () => {
    const btnMulti = screen.getByRole("button", { name: "2" });
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    userEvent.click(btnMulti);
    userEvent.click(btnStart);
    expect(location.pathname).toBe("/game/multi/4x4");
  });

  it("should be able to start a game of size 6x6", () => {
    const btn6x6 = screen.getByRole("button", { name: /^6x6$/i });
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    userEvent.click(btn6x6);
    userEvent.click(btnStart);
    expect(location.pathname).toBe("/game/solo/6x6");
  });
});
