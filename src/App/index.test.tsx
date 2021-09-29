import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { useGameState, GameState } from "../components/Game";

describe("start game page", () => {
  let gameState: GameState;

  const WrappedApp = () => {
    gameState = useGameState();
    return <App state={gameState} />;
  };

  beforeEach(() => {
    render(<WrappedApp />);
  });
  it("should have a title", () => {
    screen.getByText(/^memory$/i);
  });

  it("should be able to choose theme", () => {
    screen.getByText(/^select theme$/i);
    const numberBtn = screen.getByRole("button", { name: /^numbers$/i });
    const iconsBtn = screen.getByRole("button", { name: /^icons$/i });

    expect(gameState).toHaveProperty("theme", "numbers");
    expect(numberBtn).toHaveClass("button-active");
    expect(iconsBtn).not.toHaveClass("button-active");

    userEvent.click(iconsBtn);
    expect(gameState).toHaveProperty("theme", "icons");
    expect(numberBtn).not.toHaveClass("button-active");
    expect(iconsBtn).toHaveClass("button-active");

    userEvent.click(numberBtn);
    expect(gameState).toHaveProperty("theme", "numbers");
  });

  it("should be able to choose number of players", () => {
    screen.getByText(/^number of players$/i);
    screen.getByRole("button", { name: /^1$/i });
    screen.getByRole("button", { name: /^2$/i });
    screen.getByRole("button", { name: /^3$/i });
    screen.getByRole("button", { name: /^4$/i });
  });

  it("should be able to choose grid size", () => {
    screen.getByText(/^Grid Size$/i);
    screen.getByRole("button", { name: /^4x4$/i });
    screen.getByRole("button", { name: /^6x6$/i });
  });

  it("should be able to start a game", () => {
    screen.getByRole("button", { name: /^start game$/i });
  });
});
