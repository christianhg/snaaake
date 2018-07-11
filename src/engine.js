import { Machine } from 'xstate'
import { bindKeys } from './keyboard'
import { createTimer } from './timer'

const engineMachine = Machine({
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
})

export const createEngine = ({
  step,
  tick,
  subscribe,
  initialState,
  keyBindings: { element, bindings },
}) => {
  const getState = () => state
  const setState = newState => {
    state = newState
  }

  let status = engineMachine.initialState.value
  let state = initialState
  let unbind
  let startTimer = createTimer({
    step,
    tick,
    getState,
    setState: newState => {
      state = newState
      subscribe({ status, state })
    },
  })
  let stopTimer

  const actionMap = {
    startEngine: () => {
      stopTimer = startTimer()
      unbind = bindKeys({ element, bindings, getState, setState })
    },
    pauseEngine: () => {
      stopTimer()
      unbind()
    },
    stopEngine: () => {
      state = initialState
      stopTimer()
      unbind()
    },
  }

  const dispatch = event => {
    const nextStatus = engineMachine.transition(status, event)

    nextStatus.actions.forEach(actionKey => {
      const action = actionMap[actionKey]

      if (action) {
        action(event)
      }
    })

    status = nextStatus.value

    subscribe({ status, state })
  }

  return {
    getState,
    getStatus: () => status,
    start() {
      dispatch({ type: 'START' })
    },
    pause() {
      dispatch({ type: 'PAUSE' })
    },
    resume() {
      dispatch({ type: 'RESUME' })
    },
    stop() {
      dispatch({ type: 'STOP' })
    },
  }
}
