import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Machine } from 'xstate'
import { Canvas } from './canvas'
import { bindKeys } from './keyboard'
import { Vec } from './math'
import {
  createCircle,
  createSquare,
  updateCirclePos,
  updateCircleVel,
} from './shapes'
import { createTimer } from './timer'

const update = (step, { circle, bounds }) => {
  return {
    circle: updateCirclePos(updateCircleVel(circle, step, bounds), step),
    bounds,
  }
}

const gameMachine = Machine({
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
      onEntry: 'startGame',
    },
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'stopped',
      },
      onEntry: 'pauseGame',
    },
    stopped: {
      on: {
        START: 'running',
      },
      onEntry: 'stopGame',
    },
  },
})

class Froke extends Component {
  constructor() {
    super()

    const initialScene = {
      circle: createCircle(20, Vec(320, 320), Vec(100, 50)),
      bounds: createSquare(Vec(0, 0), Vec(640, 640)),
    }

    const getStartTimer = initialScene =>
      createTimer({
        step: 1 / 60,
        update,
        render: scene => this.setState({ scene }),
        initialScene,
      })

    let unbindKeys

    this.actionMap = {
      startGame: () => {
        this.stopTimer = this.startTimer()
        unbindKeys = bindKeys(
          window,
          new Map([
            [
              'ArrowUp',
              {
                down: () => console.log('up-down'),
                up: () => console.log('up-up'),
              },
            ],
            [
              'ArrowRight',
              {
                down: () => console.log('right-down'),
                up: () => console.log('right-up'),
              },
            ],
            [
              'ArrowDown',
              {
                down: () => console.log('down-down'),
                up: () => console.log('down-up'),
              },
            ],
            [
              'ArrowLeft',
              {
                down: () => console.log('left-down'),
                up: () => console.log('left-up'),
              },
            ],
          ])
        )
      },
      pauseGame: () => {
        this.stopTimer()
        this.startTimer = getStartTimer(this.state.scene)
      },
      stopGame: () => {
        this.stopTimer()
        this.setState({ scene: initialScene })
        this.startTimer = getStartTimer(initialScene)
        unbindKeys()
      },
    }

    this.state = {
      game: gameMachine.initialState.value,
      scene: initialScene,
    }

    this.startTimer = getStartTimer(initialScene)
  }

  dispatch(event) {
    const nextState = gameMachine.transition(this.state.game, event)

    nextState.actions.forEach(actionKey => {
      const action = this.actionMap[actionKey]

      if (action) {
        action(event)
      }
    })

    this.setState({
      game: nextState.value,
    })
  }

  render() {
    return (
      <div>
        <p>
          Current state: <b>{this.state.game}</b>
        </p>
        {this.state.game === 'idle' || this.state.game === 'stopped' ? (
          <button onClick={() => this.dispatch({ type: 'START' })}>
            Start
          </button>
        ) : (
          undefined
        )}
        {this.state.game === 'running' ? (
          <button onClick={() => this.dispatch({ type: 'PAUSE' })}>
            Pause
          </button>
        ) : (
          undefined
        )}
        {this.state.game === 'paused' ? (
          <button onClick={() => this.dispatch({ type: 'RESUME' })}>
            Resume
          </button>
        ) : (
          undefined
        )}
        {this.state.game === 'running' || this.state.game === 'paused' ? (
          <button onClick={() => this.dispatch({ type: 'STOP' })}>Stop</button>
        ) : (
          undefined
        )}
        <Canvas scene={this.state.scene} />
      </div>
    )
  }
}

ReactDOM.render(<Froke />, document.getElementById('root'))
