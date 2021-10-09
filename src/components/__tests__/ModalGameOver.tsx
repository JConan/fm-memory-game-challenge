import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalGameOver } from "../ModalGameOver";

describe("componenu Solo GameOver", () => {
  it("should render the layout", () => {
    const elapsedTime = "1:53";
    const moveCount = 39;
    render(<ModalGameOver {...{ elapsedTime, moveCount }} />);

    screen.getByRole("dialog");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "You did it!"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Game over! Here's how you got on..."
    );
    const time = screen.getByLabelText("Time Elapsed");
    expect(time).toHaveValue(elapsedTime);

    const move = screen.getByLabelText("Moves Taken");
    expect(move).toHaveValue(`${moveCount} Moves`);

    screen.getByRole("button", { name: "Restart" });
    screen.getByRole("button", { name: "Setup New Game" });
  });

  it("should have a callback for closing this dialog", () => {
    const fakeFn = jest.fn();
    render(<ModalGameOver onClose={fakeFn} />);
    userEvent.click(screen.getByRole("dialog"));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should have a callback for restart game", () => {
    const fakeFn = jest.fn();
    render(<ModalGameOver onRestart={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });

  it("should have a callback for new game", () => {
    const fakeFn = jest.fn();
    render(<ModalGameOver onNewGame={fakeFn} />);
    userEvent.click(screen.getByRole("button", { name: /new/i }));
    expect(fakeFn).toBeCalledTimes(1);
  });
});
