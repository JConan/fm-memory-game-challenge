import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { App } from "..";

describe("running App", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  it("should render initial screen", () => {
    screen.getByText(/memory/i);
  });

  it("should be able to start game", () => {
    const btnStart = screen.getByRole("button", { name: /start/i });
    act(() => {
      userEvent.click(btnStart);
    });

    const tiles = screen.queryAllByRole("listitem", { name: "memory item" });
    tiles.forEach((tile) => expect(tile).toBeInTheDocument());
  });
});
