import userEvent from "@testing-library/user-event";
import { useLocation, MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { Location } from "history";
import { GameSettingScreen } from "../GameSetting";
import { act } from "react-dom/test-utils";
import { useGameSetting, GameSetting } from "../../hooks/useGameSetting";

describe("start game screen", () => {
  let gameSetting: GameSetting = undefined!;
  let location: Location = undefined!;

  const WrappedApp = () => {
    gameSetting = useGameSetting();
    location = useLocation();
    return <GameSettingScreen gameSetting={gameSetting} />;
  };

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <WrappedApp />
      </MemoryRouter>
    );
  });
  it("should have a title", () => {
    screen.getByText(/^memory$/i);
  });

  it("should be able to choose theme", async () => {
    screen.getByText(/^select theme$/i);
    const btnNumbers = screen.getByRole("button", { name: /^numbers$/i });
    const btnIcons = screen.getByRole("button", { name: /^icons$/i });

    expect(gameSetting.value.theme).toBe("Numbers");
    expect(btnNumbers).toHaveClass("button-active");
    expect(btnIcons).not.toHaveClass("button-active");

    await act(async () => {
      await userEvent.click(btnIcons);
    });

    expect(gameSetting.value.theme).toBe("Icons");
    expect(btnNumbers).not.toHaveClass("button-active");
    expect(btnIcons).toHaveClass("button-active");

    await act(async () => {
      await userEvent.click(btnNumbers);
    });
    expect(gameSetting.value.theme).toBe("Numbers");
  });

  it("should be able to choose grid size", async () => {
    screen.getByText(/^Grid Size$/i);
    expect(gameSetting.value).toHaveProperty("gridSize", "4x4");

    const btn4x4 = screen.getByRole("button", { name: /^4x4$/i });
    const btn6x6 = screen.getByRole("button", { name: /^6x6$/i });

    await act(async () => {
      await userEvent.click(btn6x6);
    });

    expect(gameSetting.value.gridSize).toBe("6x6");
    expect(btn6x6).toHaveClass("button-active");
    expect(btn4x4).not.toHaveClass("button-active");

    await act(async () => {
      await userEvent.click(btn4x4);
    });
    expect(gameSetting.value.gridSize).toBe("4x4");
    expect(btn4x4).toHaveClass("button-active");
    expect(btn6x6).not.toHaveClass("button-active");
  });

  it("should be able to choose numbers of players", async () => {
    screen.getByText(/^numbers of players$/i);
    const buttons = ["1", "2", "3", "4"].map((number) =>
      screen.getByRole("button", { name: number })
    );
    expect(gameSetting.value.numberOfPlayers).toBe(1);
    expect(buttons[0]).toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).not.toHaveClass("button-active");
    expect(buttons[3]).not.toHaveClass("button-active");

    await act(async () => {
      await userEvent.click(buttons[3]);
    });
    expect(gameSetting.value.numberOfPlayers).toBe(4);
    expect(buttons[0]).not.toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).not.toHaveClass("button-active");
    expect(buttons[3]).toHaveClass("button-active");
  });

  it("should be able to start a game of size 4x4", async () => {
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    await act(async () => {
      await userEvent.click(btnStart);
    });
    expect(location.pathname).toBe("/game");
    expect(gameSetting.value.gridSize).toBe("4x4");
  });

  it("should be able to start a game of size 4x4 multiplayer", async () => {
    const btnMulti = screen.getByRole("button", { name: "2" });
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    await act(async () => {
      await userEvent.click(btnMulti);
      await userEvent.click(btnStart);
    });
    expect(location.pathname).toBe("/game");
    expect(gameSetting.value.numberOfPlayers).toBe(2);
  });

  it("should be able to start a game of size 6x6", async () => {
    const btn6x6 = screen.getByRole("button", { name: /^6x6$/i });
    const btnStart = screen.getByRole("button", { name: /^start game$/i });
    await act(async () => {
      await userEvent.click(btn6x6);
      await userEvent.click(btnStart);
    });
    expect(location.pathname).toBe("/game");
    expect(gameSetting.value.gridSize).toBe("6x6");
  });
});
