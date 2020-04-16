import {
  StateSchema,
  Machine,
  interpret,
  Interpreter,
  assign,
  StateMachine,
} from 'xstate';

interface SnakeStateSchema extends StateSchema {
  states: {
    idle: {};
    moving: {
      states: {
        up: {
          states: {
            locked: {};
            unlocked: {};
          };
        };
        right: {
          states: {
            locked: {};
            unlocked: {};
          };
        };
        down: {
          states: {
            locked: {};
            unlocked: {};
          };
        };
        left: {
          states: {
            locked: {};
            unlocked: {};
          };
        };
      };
    };
    dead: {};
    paused: {};
  };
}

export type SnakeContext<TApples, TBounds, TSnake> = {
  bounds: TBounds;
  apples: TApples;
  snake: TSnake;
  nextDirection?: Direction;
};

type SnakeEvent =
  | { type: 'UP' }
  | { type: 'RIGHT' }
  | { type: 'DOWN' }
  | { type: 'LEFT' }
  | { type: 'SPACE' }
  | { type: 'ESCAPE' }
  | { type: 'TICK' };

export type SnakeMachineState<TApples, TBounds, TSnake> = NonNullable<
  StateMachine<
    SnakeContext<TApples, TBounds, TSnake>,
    SnakeStateSchema,
    SnakeEvent
  >['initial']
>;

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

export type GrowSnake<TApples, TSnake> = ({
  apples,
  snake,
  direction,
}: {
  apples: TApples;
  snake: TSnake;
  direction: Direction;
}) => { apples: TApples; snake: TSnake };

export type MoveSnake<TSnake> = (snake: TSnake, direction: Direction) => TSnake;

export function createSnakeMachine<TApples, TBounds, TSnake>({
  initialData,
  resetData,
  updateApples,
  willExceedBounds,
  willEatApple,
  willHitItself,
  move,
  grow,
  onUpdate,
}: {
  initialData: SnakeContext<TApples, TBounds, TSnake>;
  resetData: () => SnakeContext<TApples, TBounds, TSnake>;
  updateApples: (context: SnakeContext<TApples, TBounds, TSnake>) => TApples;
  willExceedBounds: WillExceedBounds<TBounds, TSnake>;
  willEatApple: WillEatApple<TApples, TSnake>;
  willHitItself: WillHitItself<TSnake>;
  move: MoveSnake<TSnake>;
  grow: GrowSnake<TApples, TSnake>;
  onUpdate: ({
    apples,
    snake,
    state,
  }: {
    apples: TApples;
    snake: TSnake;
    state: SnakeMachineState<TApples, TBounds, TSnake>;
  }) => void;
}): SnakeMachine<TApples, TBounds, TSnake> {
  const machine = Machine<
    SnakeContext<TApples, TBounds, TSnake>,
    SnakeStateSchema,
    SnakeEvent
  >(
    {
      id: 'snake',
      context: initialData,
      initial: 'idle',
      states: {
        idle: {
          on: {
            UP: { target: 'moving.up' },
            RIGHT: { target: 'moving.right' },
            DOWN: { target: 'moving.down' },
            LEFT: { target: 'moving.left' },
          },
        },
        moving: {
          on: {
            SPACE: { target: '#snake.paused' },
            UP: { actions: ['queueUp'] },
            RIGHT: { actions: ['queueRight'] },
            DOWN: { actions: ['queueDown'] },
            LEFT: { actions: ['queueLeft'] },
          },
          states: {
            up: {
              entry: ['resetQueue'],
              on: {
                TICK: [
                  { target: '#snake.dead', cond: 'boundUp' },
                  { target: '#snake.dead', cond: 'snakeUp' },
                  {
                    cond: 'appleUp',
                    target: '.unlocked',
                    actions: ['growUp', 'updateApples', 'notifyUpdate'],
                  },
                  { target: '.unlocked', actions: ['moveUp', 'notifyUpdate'] },
                ],
              },
              initial: 'locked',
              states: {
                locked: {},
                unlocked: {
                  on: {
                    '': [
                      { cond: 'rightQueued', target: '#snake.moving.right' },
                      { cond: 'leftQueued', target: '#snake.moving.left' },
                    ],
                  },
                },
              },
            },
            right: {
              entry: ['resetQueue'],
              on: {
                TICK: [
                  { target: '#snake.dead', cond: 'boundRight' },
                  { target: '#snake.dead', cond: 'snakeRight' },
                  {
                    cond: 'appleRight',
                    target: '.unlocked',
                    actions: ['growRight', 'updateApples', 'notifyUpdate'],
                  },
                  {
                    target: '.unlocked',
                    actions: ['moveRight', 'notifyUpdate'],
                  },
                ],
              },
              initial: 'locked',
              states: {
                locked: {},
                unlocked: {
                  on: {
                    '': [
                      { cond: 'upQueued', target: '#snake.moving.up' },
                      { cond: 'downQueued', target: '#snake.moving.down' },
                    ],
                  },
                },
              },
            },
            down: {
              entry: ['resetQueue'],
              on: {
                TICK: [
                  { target: '#snake.dead', cond: 'boundDown' },
                  { target: '#snake.dead', cond: 'snakeDown' },
                  {
                    cond: 'appleDown',
                    target: '.unlocked',
                    actions: ['growDown', 'updateApples', 'notifyUpdate'],
                  },
                  {
                    target: '.unlocked',
                    actions: ['moveDown', 'notifyUpdate'],
                  },
                ],
              },
              initial: 'locked',
              states: {
                locked: {},
                unlocked: {
                  on: {
                    '': [
                      { cond: 'rightQueued', target: '#snake.moving.right' },
                      { cond: 'leftQueued', target: '#snake.moving.left' },
                    ],
                  },
                },
              },
            },
            left: {
              entry: ['resetQueue'],
              on: {
                TICK: [
                  { target: '#snake.dead', cond: 'boundLeft' },
                  { target: '#snake.dead', cond: 'snakeLeft' },
                  {
                    cond: 'appleLeft',
                    target: '.unlocked',
                    actions: ['growLeft', 'updateApples', 'notifyUpdate'],
                  },
                  {
                    target: '.unlocked',
                    actions: ['moveLeft', 'notifyUpdate'],
                  },
                ],
              },
              initial: 'locked',
              states: {
                locked: {},
                unlocked: {
                  on: {
                    '': [
                      { cond: 'upQueued', target: '#snake.moving.up' },
                      { cond: 'downQueued', target: '#snake.moving.down' },
                    ],
                  },
                },
              },
            },
          },
        },
        dead: {
          entry: ['notifyUpdate'],
          on: {
            SPACE: { target: 'idle', actions: ['reset', 'notifyUpdate'] },
          },
        },
        paused: {
          entry: ['notifyUpdate'],
          on: {
            SPACE: { target: 'idle', actions: ['notifyUpdate'] },
            ESCAPE: { target: 'idle', actions: ['reset', 'notifyUpdate'] },
          },
        },
      },
    },
    {
      actions: {
        queueUp: assign({
          nextDirection: ({ nextDirection }) => Direction.up,
        }),
        queueRight: assign({
          nextDirection: ({ nextDirection }) => Direction.right,
        }),
        queueDown: assign({
          nextDirection: ({ nextDirection }) => Direction.down,
        }),
        queueLeft: assign({
          nextDirection: ({ nextDirection }) => Direction.left,
        }),
        resetQueue: assign({
          nextDirection: ({ nextDirection }) => undefined,
        }),

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

        updateApples: assign({
          apples: ({ apples, bounds, snake }) =>
            updateApples({ apples, bounds, snake }),
        }),

        notifyUpdate: ({ apples, snake }, event, meta) => {
          onUpdate({
            apples,
            snake,
            state: (typeof meta.state.value === 'string'
              ? meta.state.value
              : Object.keys(meta.state.value)[0]) as SnakeMachineState<
              TApples,
              TBounds,
              TSnake
            >,
          });
        },

        reset: assign({
          apples: ({ apples }) => resetData().apples,
          snake: ({ snake }) => resetData().snake,
        }),
      },
      guards: {
        upQueued: ({ nextDirection }) => nextDirection === Direction.up,
        rightQueued: ({ nextDirection }) => nextDirection === Direction.right,
        downQueued: ({ nextDirection }) => nextDirection === Direction.down,
        leftQueued: ({ nextDirection }) => nextDirection === Direction.left,

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
