import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { random } from "faker";
import { useState } from "react";
import { SelectOptions } from "../SelectOptions";

describe("build a generic select option component", () => {
  const label = random.word();
  const values = ["A", "B", "C"] as const;
  const initialSelectedVale = "A";
  const WrappedSelectOptions = () => {
    const [selected, select] =
      useState<typeof values[number]>(initialSelectedVale);

    const onSelect = (value: typeof values[number]) => {
      select(value);
    };

    return <SelectOptions {...{ label, values, selected, onSelect }} />;
  };

  beforeEach(() => {
    render(<WrappedSelectOptions />);
  });

  it("should be have a label", () => {
    screen.getByText(label);
  });

  it("should have button for choosing another value", () => {
    const buttons = values.map((name) => screen.getByRole("button", { name }));
    expect(buttons[0]).toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).not.toHaveClass("button-active");

    userEvent.click(buttons[2]);
    expect(buttons[0]).not.toHaveClass("button-active");
    expect(buttons[1]).not.toHaveClass("button-active");
    expect(buttons[2]).toHaveClass("button-active");
  });
});
