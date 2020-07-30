import { Machine, assign, actions, interpret } from "xstate";
import { from } from "rxjs";

const { log } = actions;

const counterDiv = document.querySelector("#count");
const incrementButton = document.querySelector("#increment");

const machine = Machine(
  {
    initial: "mainView",
    context: {
      count: 0,
    },
    states: {
      mainView: {
        on: {
          INCREMENT: {
            target: "mainView",
            actions: ["incrementCount", "log"],
          },
        },
      },
    },
  },
  {
    actions: {
      log: log(
        (context, event) =>
          `The count is now ${context.count}. The event was of type ${event.type}`,
        "LOG:"
      ),
      incrementCount: assign({
        count: (context) => context.count + 1,
      }),
    },
  }
);

const service = interpret(machine).start();

const state$ = from(service);

state$.subscribe((state) => (counterDiv.innerHTML = state.context.count));

incrementButton.addEventListener("click", () => service.send("INCREMENT"));
