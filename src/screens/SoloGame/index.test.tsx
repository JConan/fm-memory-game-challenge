import { render, screen } from "@testing-library/react";
import { SoloGame } from ".";

describe("solo game small screen", () => {
  it("should have layout", () => {
    render(<SoloGame />);
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
