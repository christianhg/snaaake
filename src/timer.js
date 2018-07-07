export const createTimer = ({ step, update, render, initialScene }) => () => {
  let lastTime = 0
  let accumulatedTime = 0
  let frameId
  let scene = initialScene

  const animate = time => {
    if (lastTime) {
      accumulatedTime = accumulatedTime + (time - lastTime) / 1000

      while (accumulatedTime >= step) {
        accumulatedTime = accumulatedTime - step

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
