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

export enum Direction {
  up = 'up',
  right = 'right',
  down = 'down',
  left = 'left',
}

export type WillExceedBounds<TBounds, TSnake> = ({
  bounds,
  snake,
  direction,
}: {
  bounds: TBounds;
  snake: TSnake;
  direction: Direction;
}) => boolean;

export type WillHitItself<TSnake> = ({
  snake,
  direction,
}: {
  snake: TSnake;
  direction: Direction;
}) => boolean;

export type WillEatApple<TApples, TSnake> = ({
  apples,
  snake,
  direction,
}: {
  apples: TApples;
  snake: TSnake;
  direction: Direction;
}) => boolean;

export function createSnakeMachine<TApples, TBounds, TSnake>({
  context,
  willExceedBounds,
  willEatApple,
  willHitItself,
  move,
  grow,
  onUpdate,
  onDead,
}: {
  context: SnakeContext<TApples, TBounds, TSnake>;
  willExceedBounds: WillExceedBounds<TBounds, TSnake>;
  willEatApple: WillEatApple<TApples, TSnake>;
  willHitItself: WillHitItself<TSnake>;
  move: (snake: TSnake, direction: Direction) => TSnake;
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
              { target: 'dead', cond: 'boundUp' },
              { target: 'dead', cond: 'snakeUp' },
              { target: 'up', cond: 'appleUp', actions: 'growUp' },
              { target: 'up', actions: 'moveUp' },
            ],
            RIGHT: [
              { target: 'dead', cond: 'boundRight' },
              { target: 'dead', cond: 'snakeRight' },
              { target: 'right', cond: 'appleRight', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
            DOWN: [
              { target: 'dead', cond: 'boundDown' },
              { target: 'dead', cond: 'snakeDown' },
              { target: 'down', cond: 'appleDown', actions: 'growDown' },
              { target: 'down', actions: 'moveDown' },
            ],
            LEFT: [
              { target: 'dead', cond: 'boundLeft' },
              { target: 'dead', cond: 'snakeLeft' },
              { target: 'left', cond: 'appleLeft', actions: 'growLeft' },
              { target: 'left', actions: 'moveLeft' },
            ],
          },
        },
        up: {
          onEntry: 'notifyUpdate',
          on: {
            RIGHT: [
              { target: 'dead', cond: 'boundRight' },
              { target: 'dead', cond: 'snakeRight' },
              { target: 'right', cond: 'appleRight', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
            LEFT: [
              { target: 'dead', cond: 'boundLeft' },
              { target: 'dead', cond: 'snakeLeft' },
              { target: 'left', cond: 'appleLeft', actions: 'growLeft' },
              { target: 'left', actions: 'moveLeft' },
            ],
            TICK: [
              { target: 'dead', cond: 'boundUp' },
              { target: 'dead', cond: 'snakeUp' },
              { target: 'up', cond: 'appleUp', actions: 'growUp' },
              { target: 'up', actions: 'moveUp' },
            ],
          },
        },
        right: {
          onEntry: 'notifyUpdate',
          on: {
            UP: [
              { target: 'dead', cond: 'boundUp' },
              { target: 'dead', cond: 'snakeUp' },
              { target: 'up', cond: 'appleUp', actions: 'growUp' },
              { target: 'up', actions: 'moveUp' },
            ],
            DOWN: [
              { target: 'dead', cond: 'boundDown' },
              { target: 'dead', cond: 'snakeDown' },
              { target: 'down', cond: 'appleDown', actions: 'growDown' },
              { target: 'down', actions: 'moveDown' },
            ],
            TICK: [
              { target: 'dead', cond: 'boundRight' },
              { target: 'dead', cond: 'snakeRight' },
              { target: 'right', cond: 'appleRight', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
          },
        },
        down: {
          onEntry: 'notifyUpdate',
          on: {
            RIGHT: [
              { target: 'dead', cond: 'boundRight' },
              { target: 'dead', cond: 'snakeRight' },
              { target: 'right', cond: 'appleRight', actions: 'growRight' },
              { target: 'right', actions: 'moveRight' },
            ],
            LEFT: [
              { target: 'dead', cond: 'boundLeft' },
              { target: 'dead', cond: 'snakeLeft' },
              { target: 'left', cond: 'appleLeft', actions: 'growLeft' },
              { target: 'left', actions: 'moveLeft' },
            ],
            TICK: [
              { target: 'dead', cond: 'boundDown' },
              { target: 'dead', cond: 'snakeDown' },
              { target: 'down', cond: 'appleDown', actions: 'growDown' },
              { target: 'down', actions: 'moveDown' },
            ],
          },
        },
        left: {
          onEntry: 'notifyUpdate',
          on: {
            UP: [
              { target: 'dead', cond: 'boundUp' },
              { target: 'dead', cond: 'snakeUp' },
              { target: 'up', cond: 'appleUp', actions: 'growUp' },
              { target: 'up', actions: 'moveUp' },
            ],
            DOWN: [
              { target: 'dead', cond: 'boundDown' },
              { target: 'dead', cond: 'snakeDown' },
              { target: 'down', cond: 'appleDown', actions: 'growDown' },
              { target: 'down', actions: 'moveDown' },
            ],
            TICK: [
              { target: 'dead', cond: 'boundLeft' },
              { target: 'dead', cond: 'snakeLeft' },
              { target: 'left', cond: 'appleLeft', actions: 'growLeft' },
              { target: 'left', actions: 'moveLeft' },
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
          snake: ({ snake }) => move(snake, Direction.up),
        }),
        moveRight: assign({
          snake: ({ snake }) => move(snake, Direction.right),
        }),
        moveDown: assign({
          snake: ({ snake }) => move(snake, Direction.down),
        }),
        moveLeft: assign({
          snake: ({ snake }) => move(snake, Direction.left),
        }),

        growUp: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.up }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.up }).snake,
        }),
        growRight: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.right }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.right }).snake,
        }),
        growDown: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.down }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.down }).snake,
        }),
        growLeft: assign({
          apples: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.left }).apples,
          snake: ({ apples, snake }) =>
            grow({ apples, snake, direction: Direction.left }).snake,
        }),

        notifyUpdate: ({ apples, snake }) => onUpdate({ apples, snake }),
        notifyDead: onDead,
        resetSnake: assign({
          snake: ({ snake }) => context.snake,
        }),
      },
      guards: {
        appleUp: ({ apples, snake }) =>
          willEatApple({ apples, snake, direction: Direction.up }),
        appleRight: ({ apples, snake }) =>
          willEatApple({ apples, snake, direction: Direction.right }),
        appleDown: ({ apples, snake }) =>
          willEatApple({ apples, snake, direction: Direction.down }),
        appleLeft: ({ apples, snake }) =>
          willEatApple({ apples, snake, direction: Direction.left }),

        boundUp: ({ bounds, snake }) =>
          willExceedBounds({ bounds, snake, direction: Direction.up }),
        boundRight: ({ bounds, snake }) =>
          willExceedBounds({ bounds, snake, direction: Direction.right }),
        boundDown: ({ bounds, snake }) =>
          willExceedBounds({ bounds, snake, direction: Direction.down }),
        boundLeft: ({ bounds, snake }) =>
          willExceedBounds({ bounds, snake, direction: Direction.left }),

        snakeUp: ({ snake }) =>
          willHitItself({ snake, direction: Direction.up }),
        snakeRight: ({ snake }) =>
          willHitItself({ snake, direction: Direction.right }),
        snakeDown: ({ snake }) =>
          willHitItself({ snake, direction: Direction.down }),
        snakeLeft: ({ snake }) =>
          willHitItself({ snake, direction: Direction.left }),
      },
    }
  );

  const interpreter = interpret(machine).start();

  return interpreter;
}
