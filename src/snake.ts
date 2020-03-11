type Tuple<A, B> = [A, B];

function createCoords(a: number, b: number): Coords {
  return [a, b];
}

type Coords = Tuple<number, number>;

type Snake = ReadonlyArray<Coords>;

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
  return snake.reduceRight(
    ({ front, nextPart }, part) => {
      return nextPart
        ? {
            front: [nextPart, ...front],
            nextPart: part,
          }
        : {
            front:
              direction === 'up'
                ? [createCoords(part[0], part[1] - 1)]
                : direction === 'right'
                ? [createCoords(part[0] + 1, part[1])]
                : direction === 'down'
                ? [createCoords(part[0], part[1] + 1)]
                : [createCoords(part[0] - 1, part[1])],
            nextPart: part,
          };
    },
    {
      front: [] as Snake,
      nextPart: undefined as Coords | undefined,
    }
  ).front;
}
