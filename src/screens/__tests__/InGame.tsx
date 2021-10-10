import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Setting, useGameSetting } from "../../hooks/useGameSetting";
import { act } from "react-dom/test-utils";
import { InGame } from "../InGame";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Location } from "history";
import Chance from "chance";
import * as WindowHooks from "@react-hook/window-size";
import { useState } from "react";

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
  });
  afterEach(() => {
    jest.useRealTimers();
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
    // setup seeded tiles
    const solution = [0, 13, 11, 12, 5, 10, 1, 3, 4, 8, 6, 15, 7, 9, 2, 14];
    jest
      .spyOn(Chance, "Chance")
      .mockImplementationOnce(() => Chance("hello.frontend.io"));
    render(<WrappedSoloGame />);

    // solve grid with solution
    const tiles = screen.getAllByRole("listitem", { name: /memory item/i });
    solution.forEach((id) => {
      act(() => {
        userEvent.click(tiles[id]);
      });
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });

    expect(screen.getByText(/you did it/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restart/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new game/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Time Elapsed")).toHaveValue("0:16");
    expect(screen.getByLabelText("Moves Taken")).toHaveValue("16 Moves");
  });
});
