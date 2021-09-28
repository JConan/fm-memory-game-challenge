import React from "react";
import { render, screen } from "@testing-library/react";
import App from ".";

test("renders learn react link", () => {
  render(<App />);
  const titleElement = screen.getByText(/memory game/i);
  expect(titleElement).toBeInTheDocument();
});
