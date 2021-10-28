import { SimulatedClock } from "xstate/lib/SimulatedClock";
import { interpret } from "xstate/lib/interpreter";
import { EventObject, StateMachine, Typestate } from "xstate/lib/types";
import { State } from "xstate/lib/State";
import { init } from "xstate/lib/actionTypes";

export const InterpretWithSimulation = <TContext, TEvent extends EventObject>(
  machine: StateMachine<TContext, any, TEvent, Typestate<TContext>>
) => {
  const callStack = jest.fn();
  const clock = new SimulatedClock();
  const service = interpret(machine, { clock }).onTransition(callStack).start();

  const getTransitions = () =>
    callStack.mock.calls.map(
      ([state, event]) =>
        ({ state, event } as { state: State<TContext>; event: TEvent })
    );

  const waitUntil = (cb: (state: State<TContext>, event: TEvent) => boolean) =>
    new Promise<State<TContext> | null>(async (resolve) => {
      let retry = 10;
      do {
        await sleep(50);
        getTransitions().forEach(
          ({ state, event }) => cb(state, event) && resolve(state)
        );
      } while (retry-- > 0);
      resolve(null);
    });

  return {
    clock,
    service,
    send: service.send,
    getTransitions,
    getLastTransitions: () => getTransitions().pop()!,
    getChangedStates: () => [
      machine.initial,
      ...getTransitions()
        .filter(({ state }) => state.changed === true)
        .map(({ state }) => state.value),
    ],
    waitUntil,
  };
};

const sleep = async (ms: number) => {
  clearTimeout(
    await new Promise((resolve) => {
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        resolve(timeoutId);
      }, 50);
    })
  );
};
