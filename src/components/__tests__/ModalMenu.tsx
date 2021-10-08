import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalMenu } from "../ModalMenu";

describe("component Menu", () => {
  it("should render the layout", () => {
    render(<ModalMenu onClose={() => {}} />);
    screen.getByRole("dialog");
    screen.getByRole("button", { name: /restart/i });
    screen.getByRole("button", { name: /new game/i });
    screen.getByRole("button", { name: /resume game/i });
  });

  it("should have a callback for closing this dialog", () => {
    const fakeFn = jest.fn();
    render(<ModalMenu onClose={fakeFn} />);
    userEvent.click(screen.getByRole("dialog"));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should have a callback for restart game", () => {
    const fakeFn = jest.fn();
    render(<ModalMenu onClose={() => {}} onRestart={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should have a callback for new game", () => {
    const fakeFn = jest.fn();
    render(<ModalMenu onClose={() => {}} onNewGame={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /new/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should have a callback for resume game", () => {
    const fakeFn = jest.fn();
    render(<ModalMenu onClose={() => {}} onResume={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });
});
