import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas, CanvasSettings } from './engine/canvas';
import {
  SnakeMachine,
  SnakeMachineState,
  createSnakeMachine,
} from './snake/snake-machine';
import {
  Apples,
  Bounds,
  Snake,
  willExceedBounds,
  willEatApple,
  willHitItself,
  moveSnake,
  growSnake,
  getInitialSnakeData,
  addApple,
} from './snake/snake';
import { drawScene } from './snake/draw-snake';
import { bindKeys } from './engine/keyboard';
import { createTimer } from './engine/timer';

export class Snaaake extends Component<
  CanvasSettings,
  {
    game: {
      apples: Apples;
      bounds: Bounds;
      snake: Snake;
    };
    status: SnakeMachineState<Apples, Bounds, Snake>;
  }
> {
  private snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  constructor(props: CanvasSettings) {
    super(props);

    const game = getInitialSnakeData(props);

    this.state = {
      game,
      status: 'idle',
    };

    this.snakeMachine = createSnakeMachine<Apples, Bounds, Snake>({
      initialData: game,
      resetData: () => getInitialSnakeData(props),
      updateApples: addApple,
      willExceedBounds,
      willEatApple,
      willHitItself,
      moveSnake,
      growSnake,
      onUpdate: ({ apples, snake, state }) => {
        this.setState({
          game: {
            ...this.state.game,
            apples,
            snake,
          },
          status: state,
        });
      },
    });

    bindKeys({
      element: window,
      handlers: new Map([
        [
          [' '],
          {
            down: () => {
              this.snakeMachine.send('SPACE');
            },
          },
        ],
        [
          ['Escape'],
          {
            down: () => {
              this.snakeMachine.send('ESCAPE');
            },
          },
        ],
        [
          ['w', 'ArrowUp'],
          {
            down: () => {
              this.snakeMachine.send('UP');
            },
          },
        ],
        [
          ['d', 'ArrowRight'],
          {
            down: () => {
              this.snakeMachine.send('RIGHT');
            },
          },
        ],
        [
          ['s', 'ArrowDown'],
          {
            down: () => {
              this.snakeMachine.send('DOWN');
            },
          },
        ],
        [
          ['a', 'ArrowLeft'],
          {
            down: () => {
              this.snakeMachine.send('LEFT');
            },
          },
        ],
      ]),
    });
  }

  componentDidMount() {
    createTimer({
      step: 1 / 8,
      onTick: () => {
        this.snakeMachine.send('TICK');
      },
    });
  }

  render() {
    return (
      <div>
        <h1>🅂🄽🄰🄰🄰🄺🄴</h1>
        <p className="score">{this.state.game.snake.length - 1}</p>
        <Canvas
          settings={this.props}
          state={this.state.game}
          draw={drawScene}
        />
        <p>
          {this.state.status === 'idle' ? (
            <>
              <kbd>↑</kbd>
              <kbd>→</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
            </>
          ) : this.state.status === 'moving' ? (
            <>
              <kbd>
                Space <span>(pause)</span>
              </kbd>
            </>
          ) : this.state.status === 'paused' ? (
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
      </div>
    );
  }
}
