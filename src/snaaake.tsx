import 'modern-normalize';
import React, { useEffect, useState } from 'react';
import { Canvas, CanvasSettings } from './engine/canvas';
import { bindKeys } from './engine/keyboard';
import { createTimer } from './engine/timer';
import { drawScene } from './snake/draw-snake';
import {
  addApple,
  Apples,
  Bounds,
  getInitialSnakeData,
  growSnake,
  moveSnake,
  Snake,
  willEatApple,
  willExceedBounds,
  willHitItself,
} from './snake/snake';
import { createSnakeMachine, SnakeMachineState } from './snake/snake-machine';

export const Snaaake: React.FC<CanvasSettings> = ({ width, height, scale }) => {
  const [status, setStatus] =
    useState<SnakeMachineState<Apples, Bounds, Snake>>('idle');
  const [gameState, setGameState] = useState(
    getInitialSnakeData({ width, height })
  );

  const snakeMachine = createSnakeMachine<Apples, Bounds, Snake>({
    initialData: gameState,
    resetData: () => getInitialSnakeData({ width, height }),
    updateApples: addApple,
    willExceedBounds,
    willEatApple,
    willHitItself,
    moveSnake,
    growSnake,
    onUpdate: ({ apples, snake, state }) => {
      setGameState({
        ...gameState,
        apples,
        snake,
      });
      setStatus(state);
    },
  });

  useEffect(() => {
    bindKeys({
      element: window,
      handlers: new Map([
        [
          [' '],
          {
            down: () => {
              snakeMachine.send('SPACE');
            },
          },
        ],
        [
          ['Escape'],
          {
            down: () => {
              snakeMachine.send('ESCAPE');
            },
          },
        ],
        [
          ['w', 'ArrowUp'],
          {
            down: () => {
              snakeMachine.send('UP');
            },
          },
        ],
        [
          ['d', 'ArrowRight'],
          {
            down: () => {
              snakeMachine.send('RIGHT');
            },
          },
        ],
        [
          ['s', 'ArrowDown'],
          {
            down: () => {
              snakeMachine.send('DOWN');
            },
          },
        ],
        [
          ['a', 'ArrowLeft'],
          {
            down: () => {
              snakeMachine.send('LEFT');
            },
          },
        ],
      ]),
    });

    createTimer({
      step: 1 / 8,
      onTick: () => {
        snakeMachine.send('TICK');
      },
    });
  }, [snakeMachine]);

  return (
    <div>
      <h1>🅂🄽🄰🄰🄰🄺🄴</h1>
      <p className="score">{gameState.snake.length - 1}</p>
      <Canvas
        settings={{ width, height, scale }}
        state={gameState}
        draw={drawScene}
      />
      <p>
        {status === 'idle' ? (
          <>
            <kbd>↑</kbd>
            <kbd>→</kbd>
            <kbd>↓</kbd>
            <kbd>←</kbd>
          </>
        ) : status === 'moving' ? (
          <>
            <kbd>
              Space <span>(pause)</span>
            </kbd>
          </>
        ) : status === 'paused' ? (
          <>
            <kbd>
              Space <span>(resume)</span>
            </kbd>
            <kbd>
              Escape <span>(restart)</span>
            </kbd>
          </>
        ) : (
          <>
            <kbd>
              Space <span>(restart)</span>
            </kbd>
          </>
        )}
      </p>
      <p className="src">
        <a href="https://github.com/christianhg/snaaake">{'{src}'}</a>
      </p>
    </div>
  );
};
