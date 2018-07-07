import 'modern-normalize'
import { min } from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import { createTimer } from './timer'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.updateCanvas()
  }
  componentDidUpdate() {
    this.updateCanvas()
  }

  updateCanvas() {
    const canvas = this.refs.canvas
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000000'

    drawCircle(() => '#ffffff')(context)(this.props.scene)
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width={min(this.props.size, window.innerWidth)}
        height={min(this.props.size, window.innerHeight)}
      />
    )
  }
}

export const createCircle = radius => coords => ({
  coords,
  radius,
  type: 'CIRCLE',
})

export const drawCircle = colorCircle => context => ({ coords, radius }) => {
  context.strokeStyle = colorCircle({ coords, radius })
  context.beginPath()
  context.lineWidth = 2
  context.arc(coords.x, coords.y, radius - 1, 0, Math.PI * 2)
  context.closePath()
  context.stroke()
}

const update = (step, circle) => {
  return {
    ...circle,
    coords: {
      x: circle.coords.x + step * 100,
      y: circle.coords.y + step * 100,
    },
  }
}

class Froke extends React.Component {
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
