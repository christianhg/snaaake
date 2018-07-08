import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Machine } from 'xstate'
import { Canvas } from './canvas'
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
        STOP: 'stopped',
      },
      onEntry: 'startGame',
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

    this.actionMap = {
      startGame: () => {
        this.stopTimer = this.startTimer()
      },
      stopGame: () => {
        this.stopTimer()
      },
    }

    this.state = {
      game: gameMachine.initialState.value,
      scene: {
        circle: createCircle(20, Vec(320, 320), Vec(100, 50)),
        bounds: createSquare(Vec(0, 0), Vec(640, 640)),
      },
    }

    this.startTimer = createTimer({
      step: 1 / 60,
      update,
      render: scene => this.setState({ scene }),
      initialScene: this.state.scene,
    })
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
