import { render, screen } from "@testing-library/react";
import { useGameConfig } from "hooks/GameConfig";
import { SoloGame } from "./SoloGame";

describe("solo game small screen", () => {
  const WrappedSoloGame = () => {
    const state = useGameConfig();

    return <SoloGame {...state} />;
  };

  it("should have layout", () => {
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
});
