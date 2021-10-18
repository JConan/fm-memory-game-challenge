import { waitFor } from "@testing-library/dom";
import { interpret, State, StateMachine } from "xstate";

export const testMachine = (machine: StateMachine<any, any, any>) => {
  const subscriber = jest.fn();

  const service = interpret(machine);
  service.subscribe(subscriber);
  service.start();

  const waitForStateToBe = (name: string, after?: StateStack) =>
    waitFor(() => {
      const stacks = geStateStacks().filter(({ state }) => state.matches(name));

      if (stacks.length > 0) {
        if (after) {
          const idx = stacks.findIndex((stack) => stack.id >= after.id);
          if (stacks.length >= idx + 1) return stacks[idx + 1];
        } else {
          return stacks.pop()!;
        }
      }

      throw new Error("retry");
    });

  type StateStack = { id: number; state: State<any> };

  const geStateStacks = () =>
    subscriber.mock.calls.map(([state], id) => ({ id, state } as StateStack));
  return {
    service,
    subscriber,
    waitForStateToBe,
    send: service.send,
  };
};
