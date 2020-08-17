import { useState, useMemo, useEffect } from "react";
import { Machine, interpret } from "xstate";

function useMyMachine(config, options, initialContext) {
  const machine = useMemo(() => Machine(config, options, initialContext), []);
  const [state, setState] = useState(machine.initialState);
  const [context, setContext] = useState(initialContext);
  const service = useMemo(() => {
    const service = interpret(machine);
    service.onTransition(setState);
    service.onChange(setContext);
    service.init();
    return service;
  }, [machine]);

  // Stop the service when unmounting.
  useEffect(() => {
    return () => void service.stop();
  }, [service]);

  return { state, send: service.send, context, service };
}


export default useMyMachine;
