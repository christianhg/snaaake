export type Key = string;

export type KeyEvents = {
  down: () => void;
  up: () => void;
};

export const bindKeys = ({
  element,
  bindings,
}: {
  element: Window;
  bindings: Map<Key[], KeyEvents>;
}) => {
  const keyStates = new Map<Key, 'keyup' | 'keydown'>();
  const isDown = (key: Key) => keyStates.get(key) === 'keydown';
  const siblingsPressed = (keys: Key[], pressedKey: Key) =>
    keys
      .filter(key => key !== pressedKey)
      .filter(key => keyStates.get(key) === 'keydown').length > 0;

  const keydown = (event: KeyboardEvent) => {
    bindings.forEach(({ down }, keys) => {
      const keyPressed = keys.find(key => key === event.key);

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        !isDown(keyPressed)
      ) {
        down();
        keyStates.set(keyPressed, 'keydown');
      }
    });
  };

  const keyup = (event: KeyboardEvent) => {
    bindings.forEach(({ up }, keys) => {
      const keyPressed = keys.find(key => key === event.key);

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        isDown(keyPressed)
      ) {
        up();
        keyStates.set(keyPressed, 'keyup');
      }
    });
  };

  element.addEventListener('keydown', keydown);
  element.addEventListener('keyup', keyup);

  return () => {
    element.removeEventListener('keydown', keydown);
    element.removeEventListener('keyup', keyup);
  };
};
