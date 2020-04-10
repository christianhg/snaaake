export type Key = string;

export type KeyEventHandler = {
  down?: () => void;
  up?: () => void;
};

export type KeyEventHandlers = Map<Key[], KeyEventHandler>;

type KeyState = 'keyup' | 'keydown';

export type UnbindKeys = () => void;

export function bindKeys({
  element,
  handlers,
}: {
  element: Window;
  handlers: KeyEventHandlers;
}): UnbindKeys {
  const keyStates = new Map<Key, KeyState>();
  const isDown = (key: Key) => keyStates.get(key) === 'keydown';
  const siblingsPressed = (keys: Key[], pressedKey: Key) =>
    keys
      .filter(key => key !== pressedKey)
      .filter(key => keyStates.get(key) === 'keydown').length > 0;

  const onKeydown = (event: KeyboardEvent) => {
    handlers.forEach((handler, keys) => {
      const keyPressed = keys.find(key => key === event.key);

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        !isDown(keyPressed)
      ) {
        handler.down?.();
        keyStates.set(keyPressed, 'keydown');
      }
    });
  };

  const onKeyup = (event: KeyboardEvent) => {
    handlers.forEach((handler, keys) => {
      const keyPressed = keys.find(key => key === event.key);

      if (
        keyPressed &&
        !siblingsPressed(keys, keyPressed) &&
        isDown(keyPressed)
      ) {
        handler.up?.();
        keyStates.set(keyPressed, 'keyup');
      }
    });
  };

  element.addEventListener('keydown', onKeydown);
  element.addEventListener('keyup', onKeyup);

  return () => {
    element.removeEventListener('keydown', onKeydown);
    element.removeEventListener('keyup', onKeyup);
  };
}
