import { Snake, Apples, Bounds } from './snake';

// const black = '#1E2127';
// const darkGrey = '#282C34';
const grey = '#5C6370';
// const lightGrey = '#ABB2BF';
const green = '#98C379';
const red = '#E06C75';
// const yellow = '#D19A66';
// const blue = '#61AFEF';
// const magenta = '#C678DD';
// const cyan = '#56B6C2';

function drawSnake(
  snake: Snake,
  scale: number,
  context: CanvasRenderingContext2D
): void {
  snake.forEach(([x, y]) => {
    context.fillStyle = green;
    context.fillRect(x * scale + 3, y * scale + 3, scale - 6, scale - 6);
  });
}

function drawApples(
  apples: Apples,
  scale: number,
  context: CanvasRenderingContext2D
): void {
  apples.forEach(([x, y]) => {
    context.fillStyle = red;
    context.fillRect(x * scale + 3, y * scale + 3, scale - 6, scale - 6);
  });
}

export function drawScene(
  { bounds, apples, snake }: { bounds: Bounds; apples: Apples; snake: Snake },
  scale: number,
  context: CanvasRenderingContext2D
): void {
  context.clearRect(
    bounds[0][0],
    bounds[0][1],
    bounds[bounds.length - 1][0] * scale + scale,
    bounds[bounds.length - 1][1] * scale + scale
  );
  bounds.forEach(([x, y]) => {
    context.strokeStyle = grey;
    context.beginPath();
    context.lineWidth = 1;
    context.rect(x * scale + 2, y * scale + 2, scale - 4, scale - 4);
    context.stroke();
  });

  drawSnake(snake, scale, context);
  drawApples(apples, scale, context);
}
