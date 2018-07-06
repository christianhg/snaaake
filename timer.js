export const createTimer = (step, update, render) => () => {
  let lastTime = 0
  let accumulator = 0
  let frameId

  const animate = time => {
    if (lastTime) {
      accumulator = accumulator + (time - lastTime) / 1000
      while (accumulator >= step) {
        accumulator = accumulator - step

        update(step)
      }

      render()
    }

    lastTime = time
    frameId = requestAnimationFrame(animate)
  }

  frameId = requestAnimationFrame(animate)

  return () => cancelAnimationFrame(frameId)
}
