import { min } from 'ramda'
import React, { Component } from 'react'

const drawCircle = colorCircle => context => ({ coords, radius }) => {
  context.strokeStyle = colorCircle({ coords, radius })
  context.beginPath()
  context.lineWidth = 2
  context.arc(coords.x, coords.y, radius - 1, 0, Math.PI * 2)
  context.closePath()
  context.stroke()
}

export class Canvas extends Component {
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
