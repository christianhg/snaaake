import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from './canvas'
import { createEngine } from './engine'
import { Vec } from './math'
import {
  createCircle,
  createSquare,
  updateCirclePos,
  updateCircleVel,
} from './shapes'

const tick = (state, step) => ({
  ...state,
  circle: updateCirclePos(updateCircleVel(state, step), step),
})

class Froke extends Component {
  constructor() {
    super()

    this.engine = createEngine({
      step: 1 / 60,
      tick,
      subscribe: ({ state, status }) =>
        this.setState({ game: { state, status } }),
      initialState: {
        circle: createCircle(20, Vec(320, 320), Vec(100, 50)),
        bounds: createSquare(Vec(0, 0), Vec(640, 640)),
      },
      keyBindings: {
        element: window,
        bindings: new Map([
          [
            ['w', 'ArrowUp'],
            {
              down: () => console.log('up-down'),
              up: () => console.log('up-up'),
            },
          ],
          [
            ['d', 'ArrowRight'],
            {
              down: () => console.log('right-down'),
              up: () => console.log('right-up'),
            },
          ],
          [
            ['s', 'ArrowDown'],
            {
              down: () => console.log('down-down'),
              up: () => console.log('down-up'),
            },
          ],
          [
            ['a', 'ArrowLeft'],
            {
              down: () => console.log('left-down'),
              up: () => console.log('left-up'),
            },
          ],
        ]),
      },
    })

    this.state = {
      game: {
        state: this.engine.getState(),
        status: this.engine.getStatus(),
      },
    }
  }

  render() {
    return (
      <div>
        <p>
          Current status: <b>{this.state.game.status}</b>
        </p>
        {this.state.game.status === 'idle' ||
        this.state.game.status === 'stopped' ? (
          <button onClick={() => this.engine.start()}>Start</button>
        ) : (
          undefined
        )}
        {this.state.game.status === 'running' ? (
          <button onClick={() => this.engine.pause()}>Pause</button>
        ) : (
          undefined
        )}
        {this.state.game.status === 'paused' ? (
          <button onClick={() => this.engine.resume()}>Resume</button>
        ) : (
          undefined
        )}
        {this.state.game.status === 'running' ||
        this.state.game.status === 'paused' ? (
          <button onClick={() => this.engine.stop()}>Stop</button>
        ) : (
          undefined
        )}
        <Canvas scene={this.state.game.state} />
      </div>
    )
  }
}

ReactDOM.render(<Froke />, document.getElementById('root'))
