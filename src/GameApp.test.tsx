import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameApp } from "./GameApp";

describe("GameApp main component", () => {
  it("should render initial screen", () => {
    render(
      <MemoryRouter>
        <GameApp />
      </MemoryRouter>
    );
    screen.getByText(/memory/i);
  });
});
