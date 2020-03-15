import { Snake, Apples, Bounds } from './snake';

function drawSnake(
  snake: Snake,
  scale: number,
  context: CanvasRenderingContext2D
): void {
  snake.forEach(part => {
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.lineWidth = 2;
    context.rect(part[0] * scale, part[1] * scale, scale, scale);
    context.stroke();
  });
}

function drawApples(
  apples: Apples,
  scale: number,
  context: CanvasRenderingContext2D
): void {
  const firstApple = apples[0];

  if (firstApple) {
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.lineWidth = 2;
    context.arc(
      firstApple[0] * scale + scale / 2,
      firstApple[1] * scale + scale / 2,
      scale / 2,
      0,
      Math.PI * 2
    );
    context.closePath();
    context.stroke();
  }
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
  context.fillStyle = '#000000';

  drawSnake(snake, scale, context);
  drawApples(apples, scale, context);
}
