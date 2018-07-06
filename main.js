import 'modern-normalize'
import { min } from 'ramda'
import { createTimer } from './timer'

const createCanvas = size => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = min(size, window.innerWidth)
  canvas.height = min(size, window.innerHeight)

  return { canvas, context }
}

const { canvas, context } = createCanvas(640)

const backgroundColor = '#000000'

const clearCanvas = (canvas, context, backgroundColor) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = backgroundColor
  context.fillRect(0, 0, canvas.width, canvas.height)
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

const render = circle => {
  clearCanvas(canvas, context, backgroundColor)
  drawCircle(() => '#ffffff')(context)(circle)
}

const initialScene = createCircle(5)({ x: 0, y: 0 })

const startTimer = createTimer({
  step: 1 / 60,
  update,
  render,
  initialScene,
})

document.addEventListener('click', startTimer)

document.body.appendChild(canvas)
