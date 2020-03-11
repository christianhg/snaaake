import { Bounds, createSnakeMachine, Snake } from './snake-machine';
import { moveSnake } from './snake';

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
  const onUpdate = jest.fn();
  const onDead = jest.fn();

  const snakeMachine = createSnakeMachine({
    context: {
      bounds,
      snake: [[3, 3]] as Snake,
    },
    willExceedBounds: ({ snake }) => snake[0][1] === 0,
    move: moveSnake,
    onUpdate,
    onDead,
  });

  it('works', () => {
    snakeMachine.send({ type: 'UP' });
    snakeMachine.send({ type: 'TICK' });
    snakeMachine.send({ type: 'TICK' });
    snakeMachine.send({ type: 'TICK' });

    expect(onUpdate).toHaveBeenNthCalledWith(1, { snake: [[3, 2]] });
    expect(onUpdate).toHaveBeenNthCalledWith(2, { snake: [[3, 1]] });
    expect(onUpdate).toHaveBeenNthCalledWith(3, { snake: [[3, 0]] });
    expect(onDead).toHaveBeenCalled();
  });
});
