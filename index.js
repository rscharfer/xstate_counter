import { Machine, assign } from "xstate";
import React from "react";
import ReactDOM from "react-dom";
import { useMachine } from "@xstate/react";

// defines the finite state machine + state chart
const machine = Machine(
  {
    // initial state is "mainView"
    initial: "mainView",
    // we are holding the count in context
    context: {
      count: 0,
    },
    // there is actually only one state 'mainView', which is of course the initial state
    // when it is in this state, it responds to a single action INCREMENT
    states: {
      mainView: {
        on: {
          // transition occurs on every event
          // this does two things as it loops on itself
          // it increments the count and it logs
          INCREMENT: {
            actions: ["incrementCount", "log"],
          },
        },
      },
    },
  },
  {
    actions: {
      log: (context) => console.log(`The count is now ${context.count}`),
      incrementCount: assign({
        count: (context) => context.count + 1,
      }),
    },
  }
);

const app = document.querySelector("#app");

function Counter() {
  const [state, send] = useMachine(machine);
  return (
    <>
      <div id="count">{state.context.count}</div>
      <button
        id="increment"
        onClick={() => {
          send("INCREMENT");
        }}
      >
        Increment
      </button>
    </>
  );
}

ReactDOM.render(<Counter />, app);
