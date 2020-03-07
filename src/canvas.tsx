import React, { useRef, useEffect } from 'react';

export function Canvas<State>(scene: {
  width: number;
  height: number;
  state: State;
  draw: (state: State, context: CanvasRenderingContext2D) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current
      ? canvasRef.current.getContext('2d')
      : undefined;

    if (context) {
      scene.draw(scene.state, context);
    }
  });

  return <canvas ref={canvasRef} height={scene.height} width={scene.width} />;
}
