import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalContainer } from "../ModalContainer";

describe("component ModalContainer", () => {
  it("should have basic layout", () => {
    const onClose = jest.fn();
    render(<ModalContainer onClose={onClose} />);

    const dialogBox = screen.getByRole("dialog");
    userEvent.click(dialogBox);

    expect(onClose).toBeCalledTimes(1);
  });

  it("should not bubbling event from its children", () => {
    const onClose = jest.fn();
    render(
      <ModalContainer onClose={onClose}>
        <button>a</button>
      </ModalContainer>
    );

    const btnA = screen.getByRole("button", { name: "a" });
    userEvent.click(btnA);

    expect(onClose).not.toBeCalled();
  });
});
