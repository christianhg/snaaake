import { createSnakeMachine, SnakeMachine } from './snake-machine';
import {
  Apples,
  Bounds,
  moveSnake,
  willEatApple,
  growSnake,
  Snake,
  willExceedBounds,
  willHitItself,
} from './snake';

const bounds: Bounds = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [6, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [0, 5],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 5],
  [6, 5],
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
];

describe(createSnakeMachine.name, () => {
  let onUpdate: jest.Mock;
  let onDead: jest.Mock;
  let snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  beforeEach(() => {
    onUpdate = jest.fn();
    onDead = jest.fn();

    snakeMachine = createSnakeMachine<Apples, Bounds, Snake>({
      context: {
        apples: [
          [5, 3],
          [2, 3],
          [3, 4],
        ],
        bounds,
        snake: [[3, 3]],
      },
      willEatApple,
      willExceedBounds,
      willHitItself,
      move: moveSnake,
      grow: growSnake,
      onUpdate,
      onDead,
    });
  });

  it('does not update on ticks when no direction is set', () => {
    snakeMachine.send('TICK');

    expect(onUpdate).not.toBeCalled();
  });

  it('can run straight up into a wall', () => {
    snakeMachine.send('UP');
    snakeMachine.send('TICK');
    snakeMachine.send('TICK');
    snakeMachine.send('TICK');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(1, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 2]],
    });
    expect(onUpdate).toHaveBeenNthCalledWith(2, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 1]],
    });
    expect(onUpdate).toHaveBeenNthCalledWith(3, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 0]],
    });
    expect(onDead).toHaveBeenCalled();
  });

  it('can grow', () => {
    snakeMachine.send('RIGHT');
    snakeMachine.send('TICK');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(1, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[4, 3]],
    });
    expect(onUpdate).toHaveBeenNthCalledWith(2, {
      apples: [
        [2, 3],
        [3, 4],
      ],
      snake: [
        [5, 3],
        [4, 3],
      ],
    });
  });

  it('can go in circles', () => {
    snakeMachine.send('LEFT');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(1, {
      apples: [
        [5, 3],
        [3, 4],
      ],
      snake: [
        [2, 3],
        [3, 3],
      ],
    });

    snakeMachine.send('DOWN');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(2, {
      apples: [
        [5, 3],
        [3, 4],
      ],
      snake: [
        [2, 4],
        [2, 3],
      ],
    });

    snakeMachine.send('RIGHT');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(3, {
      apples: [[5, 3]],
      snake: [
        [3, 4],
        [2, 4],
        [2, 3],
      ],
    });
  });
});
