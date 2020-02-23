import React, { useRef, useEffect } from 'react';
import { Bounds, Circle, Pos } from './shapes';

const drawCircle = (
  colorCircle: (circle: { pos: Pos; radius: number }) => string
) => (context: CanvasRenderingContext2D) => ({ pos, radius }: Circle) => {
  context.strokeStyle = colorCircle({ pos, radius });
  context.beginPath();
  context.lineWidth = 2;
  context.arc(pos.x, pos.y, radius - 1, 0, Math.PI * 2);
  context.closePath();
  context.stroke();
};

function drawScene(
  scene: { bounds: Bounds; circle: Circle },
  context: CanvasRenderingContext2D
): void {
  context.clearRect(
    scene.bounds.A.x,
    scene.bounds.A.y,
    scene.bounds.C.x,
    scene.bounds.C.y
  );
  context.fillStyle = '#000000';

  drawCircle(() => '#ffffff')(context)(scene.circle);
}

export function Canvas(props: { scene: { bounds: Bounds; circle: Circle } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current
      ? canvasRef.current.getContext('2d')
      : undefined;

    if (context) {
      drawScene(props.scene, context);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      height={props.scene.bounds.C.y}
      width={props.scene.bounds.C.x}
    />
  );
}
