import { Direction, SnakeData } from './snake-machine';
import { getRandomItem } from './util';

type Tuple<A, B> = [A, B];
export type Coords = Tuple<number, number>;
export type Apple = Coords;
export type Apples = ReadonlyArray<Apple>;
export type Bounds = ReadonlyArray<Coords>;
export type Snake = ReadonlyArray<Coords>;

function createCoords(a: number, b: number): Coords {
  return [a, b];
}

export function createBounds({
  width,
  height,
}: {
  width: number;
  height: number;
}): Bounds {
  let bounds: Coords[] = [];

  for (let x = 0; x <= width - 1; x++) {
    for (let y = 0; y <= height - 1; y++) {
      bounds.push([x, y]);
    }
  }

  return bounds as Bounds;
}

function getFreeSquares({
  apples,
  bounds,
  snake,
}: SnakeData<Apples, Bounds, Snake>): Coords[] {
  return bounds
    .filter(
      bound => !snake.some(part => part[0] === bound[0] && part[1] === bound[1])
    )
    .filter(
      bound =>
        !apples.some(apple => apple[0] === bound[0] && apple[1] === bound[1])
    );
}

export function getApple({
  apples,
  bounds,
  snake,
}: SnakeData<Apples, Bounds, Snake>): Apple | undefined {
  return getRandomItem(getFreeSquares({ apples, bounds, snake }));
}

export function getInitialSnakeData({
  width,
  height,
}: {
  width: number;
  height: number;
}): SnakeData<Apples, Bounds, Snake> {
  const bounds = createBounds({ width, height });
  const snakePart = getRandomItem(bounds);

  if (!snakePart) {
    throw Error('Not enough room to create a snake');
  }

  const snake = [snakePart];

  return {
    apples: addApple({ apples: [], bounds, snake }),
    bounds,
    snake,
  };
}

export function addApple({
  bounds,
  apples,
  snake,
}: SnakeData<Apples, Bounds, Snake>): Apples {
  const apple = getApple({ apples, bounds, snake });

  return apple ? [...apples, apple] : apples;
}

export function moveSnake({
  snake,
  direction,
}: {
  snake: Snake;
  direction: Direction;
}): Snake {
  const head = snake[0];
  const newHead =
    direction === Direction.up
      ? createCoords(head[0], head[1] - 1)
      : direction === Direction.right
      ? createCoords(head[0] + 1, head[1])
      : direction === Direction.down
      ? createCoords(head[0], head[1] + 1)
      : createCoords(head[0] - 1, head[1]);

  if (snake.length === 1) {
    return [newHead];
  }

  return [newHead, ...snake.slice(0, snake.length - 1)];
}

export function willEatApple({
  apples,
  snake,
  direction,
}: {
  apples: Apples;
  snake: Snake;
  direction: Direction;
}): boolean {
  const head = snake[0];

  return direction === Direction.up
    ? apples.some(apple => apple[0] === head[0] && apple[1] === head[1] - 1)
    : direction === Direction.right
    ? apples.some(apple => apple[0] === head[0] + 1 && apple[1] === head[1])
    : direction === Direction.down
    ? apples.some(apple => apple[0] === head[0] && apple[1] === head[1] + 1)
    : apples.some(apple => apple[0] === head[0] - 1 && apple[1] === head[1]);
}

export function willExceedBounds({
  bounds,
  snake,
  direction,
}: {
  bounds: Bounds;
  snake: Snake;
  direction: Direction;
}): boolean {
  const head = snake[0];

  return direction === Direction.up
    ? !bounds.some(bound => bound[0] === head[0] && bound[1] === head[1] - 1)
    : direction === Direction.right
    ? !bounds.some(bound => bound[0] === head[0] + 1 && bound[1] === head[1])
    : direction === Direction.down
    ? !bounds.some(bound => bound[0] === head[0] && bound[1] === head[1] + 1)
    : !bounds.some(bound => bound[0] === head[0] - 1 && bound[1] === head[1]);
}

export function willHitItself({
  snake,
  direction,
}: {
  snake: Snake;
  direction: Direction;
}): boolean {
  const head = snake[0];
  const tail = snake.slice(1, snake.length);

  return direction === Direction.up
    ? tail.some(part => part[0] === head[0] && part[1] === head[1] - 1)
    : direction === Direction.right
    ? tail.some(part => part[0] === head[0] + 1 && part[1] === head[1])
    : direction === Direction.down
    ? tail.some(part => part[0] === head[0] && part[1] === head[1] + 1)
    : tail.some(part => part[0] === head[0] - 1 && part[1] === head[1]);
}

export function growSnake({
  apples,
  snake,
  direction,
}: {
  apples: Apples;
  snake: Snake;
  direction: Direction;
}): { apples: Coords[]; snake: Snake } {
  const head = snake[0];
  const newHead: Coords =
    direction === Direction.up
      ? [head[0], head[1] - 1]
      : direction === Direction.right
      ? [head[0] + 1, head[1]]
      : direction === Direction.down
      ? [head[0], head[1] + 1]
      : [head[0] - 1, head[1]];

  const newSnake: Snake = [newHead, ...snake];

  return {
    apples: apples.filter(
      apple => !(apple[0] === newHead[0] && apple[1] === newHead[1])
    ),
    snake: newSnake,
  };
}
