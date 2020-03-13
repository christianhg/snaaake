import { StateSchema, Machine, interpret, Interpreter, assign } from 'xstate';

interface SnakeStateSchema extends StateSchema {
  states: {
    idle: {};
    up: {};
    right: {};
    down: {};
    left: {};
    dead: {};
  };
}

type SnakeContext<TApples, TBounds, TSnake> = {
  bounds: TBounds;
  apples: TApples;
  snake: TSnake;
};

type SnakeEvent =
  | { type: 'UP' }
  | { type: 'RIGHT' }
  | { type: 'DOWN' }
  | { type: 'LEFT' }
  | { type: 'TICK' }
  | { type: 'RESTART' };

export type SnakeMachine<TApples, TBounds, TSnake> = Interpreter<
  SnakeContext<TApples, TBounds, TSnake>,
  SnakeStateSchema,
  SnakeEvent
>;

export function createSnakeMachine<TApples, TBounds, TSnake>({
  context,
  willExceedBounds,
  willEatApple,
  move,
  grow,
  onUpdate,
  onDead,
}: {
  context: SnakeContext<TApples, TBounds, TSnake>;
  willExceedBounds: (
    context: SnakeContext<TApples, TBounds, TSnake>,
    event: SnakeEvent
  ) => boolean;
  willEatApple: ({
    apples,
    snake,
    direction,
  }: {
    apples: TApples;
    snake: TSnake;
    direction: 'up' | 'right' | 'down' | 'left';
  }) => boolean;
  move: (snake: TSnake, direction: 'up' | 'right' | 'down' | 'left') => TSnake;
  grow: ({
    apples,
    snake,
    direction,
  }: {
    apples: TApples;
    snake: TSnake;
    direction: 'up' | 'right' | 'down' | 'left';
  }) => { apples: TApples; snake: TSnake };
  onUpdate: ({ apples, snake }: { apples: TApples; snake: TSnake }) => void;
  onDead: () => void;
}): SnakeMachine<TApples, TBounds, TSnake> {
  const machine = Machine<
    SnakeContext<TApples, TBounds, TSnake>,
    SnakeStateSchema,
    SnakeEvent
  >(
    {
      context,
      initial: 'idle',
      states: {
        idle: {
          onEntry: 'resetSnake',
          on: {
            UP: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'up', actions: 'moveUp' },
            ],
            RIGHT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'right', actions: 'moveRight' },
            ],
            DOWN: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'down' },
            ],
            LEFT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'left', cond: 'willEatApple', actions: 'growLeft' },
              { target: 'left', actions: 'moveLeft' },
            ],
          },
        },
        up: {
          onEntry: 'notifyUpdate',
          on: {
            RIGHT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'right' },
            ],
            LEFT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'left' },
            ],
            TICK: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'up', actions: 'moveUp' },
            ],
          },
        },
        right: {
          onEntry: 'notifyUpdate',
          on: {
            UP: [
              { target: 'up', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
            DOWN: [
              { target: 'down', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
            TICK: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'right', cond: 'willEatApple', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
          },
        },
        down: {
          onEntry: 'notifyUpdate',
          on: {
            RIGHT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'right', cond: 'willEatApple', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
            LEFT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'left', actions: 'moveLeft' },
            ],
          },
        },
        left: {
          onEntry: 'notifyUpdate',
          on: {
            UP: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'up' },
            ],
            DOWN: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'down', actions: 'moveDown' },
            ],
          },
        },
        dead: {
          entry: 'notifyDead',
          on: {
            RESTART: {
              target: 'idle',
            },
          },
        },
      },
    },
    {
      actions: {
        moveUp: assign({
          snake: ({ snake }) => move(snake, 'up'),
        }),
        moveRight: assign({
          snake: ({ snake }) => move(snake, 'right'),
        }),
        moveDown: assign({
          snake: ({ snake }) => move(snake, 'down'),
        }),
        moveLeft: assign({
          snake: ({ snake }) => move(snake, 'left'),
        }),
        growRight: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: 'right' }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: 'right' }).snake,
        }),
        growLeft: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: 'left' }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: 'left' }).snake,
        }),
        notifyUpdate: ({ apples, snake }) => onUpdate({ apples, snake }),
        notifyDead: onDead,
        resetSnake: assign({
          snake: ({ snake }) => context.snake,
        }),
      },
      guards: {
        willExceedBounds,
        willEatApple: ({ apples, snake }, event, meta) => {
          if (meta.state.value !== 'dead') {
            if (event.type === 'UP') {
              return willEatApple({ apples, snake, direction: 'up' });
            }
            if (event.type === 'RIGHT') {
              return willEatApple({ apples, snake, direction: 'right' });
            }
            if (event.type === 'DOWN') {
              return willEatApple({ apples, snake, direction: 'down' });
            }
            if (event.type === 'LEFT') {
              return willEatApple({ apples, snake, direction: 'left' });
            }
          }

          if (
            event.type === 'TICK' &&
            (meta.state.value === 'up' ||
              meta.state.value === 'right' ||
              meta.state.value === 'down' ||
              meta.state.value === 'left')
          ) {
            return willEatApple({ apples, snake, direction: meta.state.value });
          }

          return false;
        },
      },
    }
  );

  const interpreter = interpret(machine)
    .start()
    .onTransition((x, y) => {
      console.log(`${y.type} => ${x.value}`);
    });

  return interpreter;
}
