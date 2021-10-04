import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "./Menu";

describe("component Menu", () => {
  it("should render the layout", () => {
    render(<Menu />);
    screen.getByRole("dialog");
    screen.getByRole("button", { name: /restart/i });
    screen.getByRole("button", { name: /new game/i });
    screen.getByRole("button", { name: /resume game/i });
  });

  it("should be have a callback for restart game", () => {
    const fakeFn = jest.fn();
    render(<Menu onRestart={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should be have a callback for new game", () => {
    const fakeFn = jest.fn();
    render(<Menu onNewGame={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /new/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should be have a callback for resume game", () => {
    const fakeFn = jest.fn();
    render(<Menu onResume={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });
});
