export const bindKeys = (element, bindings) => {
  const keyStates = new Map()
  const isDown = key => keyStates.get(key) === 'keydown'
  const siblingsPressed = (keys, pressedKey) =>
    keys
      .filter(key => key !== pressedKey)
      .filter(key => keyStates.get(key) === 'keydown').length > 0

  const keydown = event => {
    bindings.forEach(({ down }, keys) => {
      const keyPressed = keys.find(key => key === event.key)

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        !isDown(keyPressed)
      ) {
        down()
        keyStates.set(keyPressed, 'keydown')
      }
    })
  }

  const keyup = event => {
    bindings.forEach(({ up }, keys) => {
      const keyPressed = keys.find(key => key === event.key)

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        isDown(keyPressed)
      ) {
        up()
        keyStates.set(keyPressed, 'keyup')
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
