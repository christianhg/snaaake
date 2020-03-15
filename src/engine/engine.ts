import { Machine, StateSchema, StateValue, interpret } from 'xstate';
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

export type Engine = {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

export const createEngine = ({
  step,
  onTick,
  onUpdate,
  onStatusChanged,
  onStop,
  keyBindings: { element, bindings },
}: {
  step: number;
  onTick: () => void;
  onUpdate: () => void;
  onStatusChanged: (status: StateValue) => void;
  onStop: () => void;
  keyBindings: { element: Window; bindings: Map<Key[], KeyEvents> };
}): Engine => {
  const engineMachine = Machine<undefined, EngineSchema, EngineEvent>(
    {
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
    },
    {
      actions: {
        startEngine: () => {
          stopTimer = startTimer();
          unbind = bindKeys({ element, bindings });
        },
        pauseEngine: () => {
          stopTimer();
          unbind();
        },
        stopEngine: () => {
          stopTimer();
          unbind();
          onStop();
        },
      },
    }
  );

  const interpreter = interpret(engineMachine)
    .start()
    .onTransition(state => {
      if (state.changed) {
        onStatusChanged(state.value);
      }
    });

  let unbind: () => void;
  let startTimer = createTimer({
    step,
    onTick,
    onUpdate: () => {
      onUpdate();
    },
  });
  let stopTimer: () => void;

  return {
    start() {
      interpreter.send('START');
    },
    pause() {
      interpreter.send('PAUSE');
    },
    resume() {
      interpreter.send('RESUME');
    },
    stop() {
      interpreter.send('STOP');
    },
  };
};
