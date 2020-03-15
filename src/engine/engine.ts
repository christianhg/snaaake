import { Machine, StateSchema, StateValue } from 'xstate';
import { bindKeys, Key, KeyEvents } from './keyboard';
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

export type Engine = {
  getStatus: () => StateValue;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

export const createEngine = ({
  step,
  onTick,
  onUpdate,
  keyBindings: { element, bindings },
}: {
  step: number;
  onTick: () => void;
  onUpdate: (status: StateValue) => void;
  keyBindings: { element: Window; bindings: Map<Key[], KeyEvents> };
}): Engine => {
  let status = engineMachine.initialState.value;

  let unbind: () => void;
  let startTimer = createTimer({
    step,
    onTick,
    onUpdate: () => {
      onUpdate(status);
    },
  });
  let stopTimer: () => void;

  const actionMap = new Map([
    [
      'startEngine',
      () => {
        stopTimer = startTimer();
        unbind = bindKeys({ element, bindings });
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
  };

  return {
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
