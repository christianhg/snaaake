type Tuple<A, B> = [A, B];

function createCoords(a: number, b: number): Coords {
  return [a, b];
}

export type Coords = Tuple<number, number>;

export type Snake = ReadonlyArray<Coords>;

export type Bounds = ReadonlyArray<Coords>;

export function updateSnake() {}

export function isValidSnake(snake: Snake): boolean {
  if (snake.length === 0) {
    return false;
  }

  if (snake.length === 1) {
    return true;
  }

  return snake.reduce(
    ({ prevPart, valid }, part) => {
      console.log(prevPart, part);
      return prevPart
        ? {
            prevPart: part,
            valid:
              valid &&
              (part[1] - 1 === prevPart[1] || part[0] - 1 === prevPart[0]),
          }
        : {
            prevPart: part,
            valid,
          };
    },
    { prevPart: undefined as Coords | undefined, valid: true }
  ).valid;
}

export function moveSnake(
  snake: Snake,
  direction: 'up' | 'right' | 'down' | 'left'
): Snake {
  console.log('move', direction, snake);

  const head = snake[0];
  const newHead =
    direction === 'up'
      ? createCoords(head[0], head[1] - 1)
      : direction === 'right'
      ? createCoords(head[0] + 1, head[1])
      : direction === 'down'
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
  apples: Coords[];
  snake: Snake;
  direction: 'up' | 'right' | 'down' | 'left';
}): boolean {
  const head = snake[0];
  console.log(direction, [head[0]+1, head[1]], apples, apples.some(apple => apple[0] === head[0] + 1 && apple[1] === head[1]))

  const will =
    direction === 'up'
      ? apples.some(apple => apple[0] === head[0] && apple[1] === head[1] - 1)
      : direction === 'right'
      ? apples.some(apple => apple[0] === head[0] + 1 && apple[1] === head[1])
      : direction === 'down'
      ? apples.some(apple => apple[0] === head[0] && apple[1] === head[1] + 1)
      : apples.some(apple => apple[0] === head[0] - 1 && apple[1] === head[1]);

  console.log(will);

  return will;
}

export function growSnake({
  apples,
  snake,
  direction,
}: {
  apples: Coords[];
  snake: Snake;
  direction: 'up' | 'right' | 'down' | 'left';
}): { apples: Coords[]; snake: Snake } {
  console.log('grow', direction);

  const head = snake[0];
  const newHead: Coords =
    direction === 'up'
      ? [head[0], head[1] - 1]
      : direction === 'right'
      ? [head[0] + 1, head[1]]
      : direction === 'down'
      ? [head[0], head[1] + 1]
      : [head[0] - 1, head[1]];

  const newSnake: Snake = [newHead, ...snake];

  console.log(newSnake);
  return {
    apples: apples.filter(
      apple => !(apple[0] === newHead[0] && apple[1] === newHead[1])
    ),
    snake: newSnake,
  };
}
