import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from './canvas'
import { createTimer } from './timer'

const Vec = (x, y) => ({ x, y })

const createCircle = radius => (pos, vel) => ({
  pos,
  radius,
  vel,
})

const createSquare = (A, B, C, D) => ({
  A,
  B,
  C,
  D,
})

const updateCircleVel = (circle, step, bounds) => ({
  ...circle,
  vel: Vec(
    updateCirclePos(circle, step).pos.x + circle.radius > bounds.C.x ||
    updateCirclePos(circle, step).pos.x - circle.radius < bounds.A.x
      ? -circle.vel.x
      : circle.vel.x,
    updateCirclePos(circle, step).pos.y + circle.radius > bounds.C.y ||
    updateCirclePos(circle, step).pos.y - circle.radius < bounds.A.y
      ? -circle.vel.y
      : circle.vel.y
  ),
})

const updateCirclePos = (circle, step) => ({
  ...circle,
  pos: Vec(
    circle.pos.x + circle.vel.x * step,
    circle.pos.y + circle.vel.y * step
  ),
})

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
        circle: createCircle(20)(Vec(320, 320), Vec(100, 50)),
        bounds: createSquare(
          Vec(0, 0),
          Vec(640, 0),
          Vec(640, 640),
          Vec(0, 640)
        ),
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
