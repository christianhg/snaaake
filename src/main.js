import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

class Froke extends Component {
  constructor() {
    super()

    this.state = {
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

  render() {
    return (
      <div>
        <button onClick={() => this.startTimer()}>Start</button>
        <Canvas scene={this.state.scene} />
      </div>
    )
  }
}

ReactDOM.render(<Froke />, document.getElementById('root'))
