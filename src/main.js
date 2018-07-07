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

const update = (step, circle) => {
  return {
    ...circle,
    pos: Vec(
      circle.pos.x + circle.vel.x * step,
      circle.pos.y + circle.vel.y * step
    ),
  }
}

class Froke extends Component {
  constructor() {
    super()

    this.state = {
      scene: createCircle(5)(Vec(0, 0), Vec(100, 100)),
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
        <Canvas size={640} scene={this.state.scene} />
      </div>
    )
  }
}

ReactDOM.render(<Froke />, document.getElementById('root'))
