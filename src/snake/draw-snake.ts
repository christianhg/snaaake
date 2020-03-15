import { Snake, Apples, Bounds } from "./snake";

function drawSnake(snake: Snake, context: CanvasRenderingContext2D): void {
  snake.forEach(part => {
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.lineWidth = 2;
    context.rect(part[0] * 10, part[1] * 10, 10, 10);
    context.stroke();
  });
}

function drawApples(apples: Apples, context: CanvasRenderingContext2D): void {
  const firstApple = apples[0];

  if (firstApple) {
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.lineWidth = 2;
    context.arc(
      firstApple[0] * 10 + 5,
      firstApple[1] * 10 + 5,
      5,
      0,
      Math.PI * 2
    );
    context.closePath();
    context.stroke();
  }
}

export function drawScene({ bounds, apples , snake}: {bounds: Bounds, apples: Apples
 snake: Snake}, context: CanvasRenderingContext2D): void {
  context.clearRect(
    bounds[0][0],
    bounds[0][1],
    bounds[bounds.length - 1][0] * 10,
    bounds[bounds.length - 1][1] * 10
  );
  context.fillStyle = '#000000';

  drawSnake(snake, context);
  drawApples(apples, context);
}
