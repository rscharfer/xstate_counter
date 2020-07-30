import { Machine, assign, actions, interpret } from "xstate";
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
            actions: ["updateDom", "incrementCount", "log"],
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
      updateDom: (context, event) => (counterDiv.innerHTML = context.count),
    },
  }
);

const service = interpret(machine);
service.start();

incrementButton.addEventListener("click", () => service.send("INCREMENT"));
