import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "..";

describe("running App", () => {
  it("should render initial screen", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    screen.getByText(/memory/i);
  });
});
