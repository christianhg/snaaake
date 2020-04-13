import {
  createSnakeMachine,
  SnakeMachine,
  SnakeContext,
} from './snake-machine';
import {
  Apples,
  Bounds,
  moveSnake,
  willEatApple,
  growSnake,
  Snake,
  willExceedBounds,
  willHitItself,
  createBounds,
} from './snake';

describe(createSnakeMachine.name, () => {
  function setUpTest(
    { apples, snake }: Omit<SnakeContext<Apples, Bounds, Snake>, 'bounds'>,
    onUpdate: jest.Mock
  ): SnakeMachine<Apples, Bounds, Snake> {
    const initialData: SnakeContext<Apples, Bounds, Snake> = {
      apples,
      bounds: createBounds({ width: 6, height: 6 }),
      snake,
    };

    return createSnakeMachine<Apples, Bounds, Snake>({
      initialData,
      resetData: () => initialData,
      updateApples: ({ apples }) => apples,
      willEatApple,
      willExceedBounds,
      willHitItself,
      move: moveSnake,
      grow: growSnake,
      onUpdate,
    });
  }

  it('does not update on ticks when no direction is set', () => {
    const onUpdate = jest.fn();
    const snakeMachine = setUpTest(
      {
        apples: [
          [5, 3],
          [2, 3],
          [3, 4],
        ],
        snake: [[3, 3]],
      },
      onUpdate
    );

    snakeMachine.send('TICK');

    expect(onUpdate).not.toBeCalled();
  });

  it('can quickly reverse its direction', () => {
    const onUpdate = jest.fn();
    const snakeMachine = setUpTest(
      {
        apples: [],
        snake: [[3, 3]],
      },
      onUpdate
    );

    snakeMachine.send('UP');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(1, {
      apples: [],
      snake: [[3, 2]],
      state: 'moving',
    });

    snakeMachine.send('RIGHT');
    snakeMachine.send('DOWN');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(2, {
      apples: [],
      snake: [[4, 3]],
      state: 'moving',
    });

    snakeMachine.send('LEFT');
    snakeMachine.send('UP');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(3, {
      apples: [],
      snake: [[3, 2]],
      state: 'moving',
    });

    snakeMachine.send('LEFT');
    snakeMachine.send('DOWN');
    snakeMachine.send('TICK');

    expect(onUpdate).toHaveBeenNthCalledWith(4, {
      apples: [],
      snake: [[2, 3]],
      state: 'moving',
    });
  });

  it('can run straight up into a wall', () => {
    const onUpdate = jest.fn();
    const snakeMachine = setUpTest(
      {
        apples: [
          [5, 3],
          [2, 3],
          [3, 4],
        ],
        snake: [[3, 3]],
      },
      onUpdate
    );

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
      state: 'moving',
    });
    expect(onUpdate).toHaveBeenNthCalledWith(2, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 1]],
      state: 'moving',
    });
    expect(onUpdate).toHaveBeenNthCalledWith(3, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 0]],
      state: 'moving',
    });
    expect(onUpdate).toHaveBeenNthCalledWith(4, {
      apples: [
        [5, 3],
        [2, 3],
        [3, 4],
      ],
      snake: [[3, 0]],
      state: 'dead',
    });
  });

  it('can grow', () => {
    const onUpdate = jest.fn();
    const snakeMachine = setUpTest(
      {
        apples: [
          [5, 3],
          [2, 3],
          [3, 4],
        ],
        snake: [[3, 3]],
      },
      onUpdate
    );

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
      state: 'moving',
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
      state: 'moving',
    });
  });

  it('can go in circles', () => {
    const onUpdate = jest.fn();
    const snakeMachine = setUpTest(
      {
        apples: [
          [5, 3],
          [2, 3],
          [3, 4],
        ],
        snake: [[3, 3]],
      },
      onUpdate
    );

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
      state: 'moving',
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
      state: 'moving',
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
      state: 'moving',
    });
  });
});
