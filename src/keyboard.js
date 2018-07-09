export const bindKeys = (element, bindings) => {
  const keyStates = new Map()

  const keydown = event => {
    bindings.forEach(({ down }, key) => {
      if (key === event.key && keyStates.get(key) !== 'keydown') {
        down()
        keyStates.set(key, 'keydown')
      }
    })
  }

  const keyup = event => {
    bindings.forEach(({ up }, key) => {
      if (key === event.key && keyStates.get(key) !== 'keyup') {
        up()
        keyStates.set(key, 'keyup')
      }
    })
  }

  element.addEventListener('keydown', keydown)
  element.addEventListener('keyup', keyup)

  return () => {
    element.removeEventListener('keydown', keydown)
    element.removeEventListener('keyup', keyup)
  }
}
