import { Machine, StateSchema, StateValue } from 'xstate';
import { bindKeys } from './keyboard';
import { createTimer } from './timer';

interface EngineSchema extends StateSchema {
  states: {
    idle: {};
    running: {};
    paused: {};
    stopped: {};
  };
}

type EngineEvent =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'RESUME' };

const engineMachine = Machine<undefined, EngineSchema, EngineEvent>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: 'running',
      },
    },
    running: {
      on: {
        PAUSE: 'paused',
        STOP: 'stopped',
      },
      onEntry: 'startEngine',
    },
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'stopped',
      },
      onEntry: 'pauseEngine',
    },
    stopped: {
      on: {
        START: 'running',
      },
      onEntry: 'stopEngine',
    },
  },
});

type Keys = string[];

type KeyEvents<State> = {
  down: (state: State) => State;
  up: (state: State) => State;
};

export const createEngine = <State>({
  step,
  tick,
  subscribe,
  initialState,
  keyBindings: { element, bindings },
}: {
  step: number;
  tick: (state: State, step: number) => State;
  subscribe: ({ state, status }: { state: State; status: StateValue }) => void;
  initialState: State;
  keyBindings: { element: any; bindings: Map<Keys, KeyEvents<State>> };
}) => {
  const getState = () => state;
  const setState = (newState: State) => {
    state = newState;
  };

  let status = engineMachine.initialState.value;
  let state = initialState;
  let unbind: () => void;
  let startTimer = createTimer({
    step,
    tick,
    getState,
    setState: newState => {
      state = newState;
      subscribe({ status, state });
    },
  });
  let stopTimer: () => void;

  const actionMap = new Map([
    [
      'startEngine',
      () => {
        stopTimer = startTimer();
        unbind = bindKeys({ element, bindings, getState, setState });
      },
    ],
    [
      'pauseEngine',
      () => {
        stopTimer();
        unbind();
      },
    ],
    [
      'stopEngine',
      () => {
        state = initialState;
        stopTimer();
        unbind();
      },
    ],
  ]);

  const dispatch = (event: EngineEvent) => {
    const nextState = engineMachine.transition(status, event);

    nextState.actions.forEach(({ type }) => {
      const action = actionMap.get(type);

      if (action) {
        action();
      }
    });

    status = nextState.value;

    subscribe({ status, state });
  };

  return {
    getState,
    getStatus: () => status,
    start() {
      dispatch({ type: 'START' });
    },
    pause() {
      dispatch({ type: 'PAUSE' });
    },
    resume() {
      dispatch({ type: 'RESUME' });
    },
    stop() {
      dispatch({ type: 'STOP' });
    },
  };
};
