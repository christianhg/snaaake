import React, { useRef, useEffect } from 'react';

export type CanvasSettings = { width: number; height: number; scale: number };

export function Canvas<State>({
  settings: { width, height, scale },
  state,
  draw,
}: {
  settings: CanvasSettings;
  state: State;
  draw: (
    state: State,
    scale: number,
    context: CanvasRenderingContext2D
  ) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current
      ? canvasRef.current.getContext('2d')
      : undefined;

    if (context) {
      draw(state, scale, context);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={width * scale + scale}
      height={height * scale + scale}
    />
  );
}
