import { Machine, assign, actions, interpret } from "xstate";
import React from "react";
import ReactDOM from "react-dom";
import { useMachine } from "@xstate/react";
import useMyMachine from "./useMyMachine";

const { log } = actions;

const machine = Machine(
  {
    initial: "mainView",
    context: {
      count: 0,
    },
    states: {
      mainView: {
        on: {
          // transition occurs on every event
          INCREMENT: {
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

const app = document.querySelector("#app");

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       current: machine.initialState,
//     };
//   }

//   service = interpret(machine).onTransition((current) =>
//     this.setState({ current })
//   );

//   componentDidMount() {
//     this.service.start();
//   }

//   componentWillUnmount() {
//     this.service.stop();
//   }

//   render() {
//     const { current } = this.state;

//     return (
//       <>
//         <div id="count">{current.context.count}</div>
//         <button
//           id="increment"
//           onClick={() => {
//             const { send } = this.service;
//             send("INCREMENT");
//           }}
//         >
//           Increment
//         </button>
//       </>
//     );
//   }
// }

function Counter() {
  const [ state, send ] = useMachine(machine);
  console.log('state is', state);
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
