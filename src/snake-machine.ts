import { StateSchema, Machine, interpret, Interpreter, assign } from 'xstate';

type Tuple<A, B> = [A, B];
export type Coords = Tuple<number, number>;
export type Snake = ReadonlyArray<Coords>;
export type Bounds = ReadonlyArray<Coords>;

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

type SnakeContext<TBounds, TSnake> = {
  bounds: TBounds;
  snake: TSnake;
};

type SnakeEvent =
  | { type: 'UP' }
  | { type: 'RIGHT' }
  | { type: 'DOWN' }
  | { type: 'LEFT' }
  | { type: 'TICK' };

type SnakeMachine<TBounds, TSnake> = Interpreter<
  SnakeContext<TBounds, TSnake>,
  SnakeStateSchema,
  SnakeEvent
>;

export function createSnakeMachine<TBounds, TSnake>({
  context,
  willExceedBounds,
  move,
  onUpdate,
  onDead,
}: {
  context: SnakeContext<TBounds, TSnake>;
  willExceedBounds: (
    context: SnakeContext<TBounds, TSnake>,
    event: SnakeEvent
  ) => boolean;
  move: (snake: TSnake, direction: 'up') => TSnake;
  onUpdate: ({ snake }: { snake: TSnake }) => void;
  onDead: () => void;
}): SnakeMachine<TBounds, TSnake> {
  const machine = Machine<
    SnakeContext<TBounds, TSnake>,
    SnakeStateSchema,
    SnakeEvent
  >(
    {
      context,
      initial: 'idle',
      states: {
        idle: {
          on: {
            UP: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'up', actions: 'moveUp' },
            ],
            RIGHT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'right' },
            ],
            DOWN: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'down' },
            ],
            LEFT: [
              { target: 'dead', cond: 'willExceedBounds' },
              { target: 'left' },
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
          on: {
            UP: [
              { target: 'up', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
            DOWN: [
              { target: 'down', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
          },
        },
        down: {
          on: {
            RIGHT: [
              { target: 'right', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
            LEFT: [
              { target: 'left', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
          },
        },
        left: {
          on: {
            UP: [
              { target: 'up', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
            DOWN: [
              { target: 'down', cond: 'willExceedBounds' },
              { target: 'dead' },
            ],
          },
        },
        dead: {
          entry: 'notifyDead',
        },
      },
    },
    {
      actions: {
        moveUp: assign({
          snake: ({ snake }) => move(snake, 'up'),
        }),
        notifyUpdate: ({ snake }) => onUpdate({ snake }),
        notifyDead: onDead,
      },
      guards: {
        willExceedBounds,
      },
    }
  );

  const interpreter = interpret(machine).start();

  return interpreter;
}
