import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from './canvas'
import { createTimer } from './timer'

const Vec = (x, y) => ({ x, y })

const createCircle = radius => pos => ({
  pos,
  radius,
})

const update = (step, circle) => {
  return {
    ...circle,
    pos: {
      x: circle.pos.x + step * 100,
      y: circle.pos.y + step * 100,
    },
  }
}

class Froke extends Component {
  constructor() {
    super()

    this.state = {
      scene: createCircle(5)(Vec(0, 0)),
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
