export const createTimer = ({ step, update, render, initialScene }) => () => {
  let lastTime = 0
  let accumulator = 0
  let frameId
  let scene = initialScene

  const animate = time => {
    if (lastTime) {
      accumulator = accumulator + (time - lastTime) / 1000
      while (accumulator >= step) {
        accumulator = accumulator - step

        scene = update(step, scene)
      }
    }

    render(scene)

    lastTime = time
    frameId = requestAnimationFrame(animate)
  }

  frameId = requestAnimationFrame(animate)

  return () => cancelAnimationFrame(frameId)
}
