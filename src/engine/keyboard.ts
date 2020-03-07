export type Key = string;

export type KeyEvents<State> = {
  down: (state: State) => State;
  up: (state: State) => State;
};

export const bindKeys = <State>({
  element,
  bindings,
  getState,
  setState,
}: {
  element: Window;
  bindings: Map<Key[], KeyEvents<State>>;
  getState: () => State;
  setState: (state: State) => void;
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
        setState(down(getState()));
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
        setState(up(getState()));
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
