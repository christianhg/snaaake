import { Machine } from 'xstate'
import { bindKeys } from './keyboard'

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
  keyBindings,
}) => {
  let status = engineMachine.initialState.value
  let state = initialState
  let lastTime = 0
  let accumulatedTime = 0
  let frameId
  let unbind

  const animate = time => {
    if (lastTime) {
      accumulatedTime = accumulatedTime + (time - lastTime) / 1000

      while (accumulatedTime >= step) {
        accumulatedTime = accumulatedTime - step

        state = tick(state, step)
      }
    }

    subscribe({ status, state })

    lastTime = time
    frameId = requestAnimationFrame(animate)
  }

  const actionMap = {
    startEngine: () => {
      frameId = requestAnimationFrame(animate)
      unbind = bindKeys(keyBindings.element, keyBindings.bindings)
    },
    pauseEngine: () => {
      lastTime = 0
      cancelAnimationFrame(frameId)
      unbind()
    },
    stopEngine: () => {
      lastTime = 0
      state = initialState
      cancelAnimationFrame(frameId)
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
    getState: () => state,
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
