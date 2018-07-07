import 'modern-normalize'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from './canvas'
import { createTimer } from './timer'

const createCircle = radius => coords => ({
  coords,
  radius,
})

const update = (step, circle) => {
  return {
    ...circle,
    coords: {
      x: circle.coords.x + step * 100,
      y: circle.coords.y + step * 100,
    },
  }
}

class Froke extends Component {
  constructor() {
    super()

    this.state = {
      scene: createCircle(5)({ x: 0, y: 0 }),
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
