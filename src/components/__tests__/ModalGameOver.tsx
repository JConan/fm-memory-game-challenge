import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalGameOver } from "../ModalGameOver";

describe("component GameOver", () => {
  describe("Solo player GameOVer screen", () => {
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

  describe("Multi player GameOver screen", () => {
    it("should render Player 3 winning", () => {
      const numberOfPlayers = 4;
      const scores = [0, 1, 4, 3] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Player 3 Wins!"
      );
    });
    it("should render Player 1 winning", () => {
      const numberOfPlayers = 4;
      const scores = [4, 1, 2, 3] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Player 1 Wins!"
      );
    });
    it("should be able to render Tie", () => {
      const numberOfPlayers = 4;
      const scores = [4, 4, 2, 3] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "It's a tie!"
      );
    });
    it("should show players ranks", () => {
      const numberOfPlayers = 4;
      const scores = [4, 1, 2, 3] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      const status = screen.getAllByRole("status", { name: /player/i });

      expect(status[0]).toHaveTextContent("Player 1 (Winner!)");
      expect(status[0].children[1]).toHaveValue("4 Pairs");

      expect(status[1]).toHaveTextContent("Player 4");
      expect(status[1].children[1]).toHaveValue("3 Pairs");

      expect(status[2]).toHaveTextContent("Player 3");
      expect(status[2].children[1]).toHaveValue("2 Pairs");

      expect(status[3]).toHaveTextContent("Player 2");
      expect(status[3].children[1]).toHaveValue("1 Pairs");
    });
    it("should show players ranks in a tie game", () => {
      const numberOfPlayers = 4;
      const scores = [4, 4, 2, 3] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      const status = screen.getAllByRole("status", { name: /player/i });

      expect(status[0]).toHaveTextContent("Player 1 (Winner!)");
      expect(status[0].children[1]).toHaveValue("4 Pairs");

      expect(status[1]).toHaveTextContent("Player 2 (Winner!)");
      expect(status[1].children[1]).toHaveValue("4 Pairs");

      expect(status[2]).toHaveTextContent("Player 4");
      expect(status[2].children[1]).toHaveValue("3 Pairs");

      expect(status[3]).toHaveTextContent("Player 3");
      expect(status[3].children[1]).toHaveValue("2 Pairs");
    });
    it("should number of ranks reflect number of players", () => {
      const numberOfPlayers = 2;
      const scores = [4, 1, 0, 0] as [number, number, number, number];
      render(<ModalGameOver {...{ numberOfPlayers, scores }} />);

      const status = screen.getAllByRole("status", { name: /player/i });
      expect(status).toHaveLength(numberOfPlayers);
    });
  });
});
