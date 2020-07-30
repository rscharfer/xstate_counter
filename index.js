import { Machine, assign, actions, interpret } from "xstate";
import React from "react";
import ReactDOM from "react-dom";

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

const service = interpret(machine);
service.start();

const app = document.querySelector("#app");

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.state = {
      count: 0,
    };
  }
  clickHandler() {
    const newState = service.send("INCREMENT");
    this.setState(() => ({
      count: newState.context.count,
    }));
  }
  render() {
    return (
      <>
        <div id="count">{this.state.count}</div>
        <button id="increment" onClick={this.clickHandler}>
          Increment
        </button>
      </>
    );
  }
}

ReactDOM.render(<Counter />, app);
