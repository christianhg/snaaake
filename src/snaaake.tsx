import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas } from './engine/canvas';
import {
  SnakeMachine,
  SnakeMachineState,
  createSnakeMachine,
} from './snake/snake-machine';
import {
  Apples,
  Bounds,
  Snake,
  createBounds,
  willExceedBounds,
  willEatApple,
  willHitItself,
  moveSnake,
  growSnake,
} from './snake/snake';
import { drawScene } from './snake/draw-snake';
import { bindKeys } from './engine/keyboard';
import { createTimer } from './engine/timer';

type State = { apples: Apples; bounds: Bounds; snake: Snake };

type SnaaakeProps = { width: number; height: number; scale: number };

export class Snaaake extends Component<
  SnaaakeProps,
  {
    game: {
      scale: number;
      state: State;
      status: SnakeMachineState<Apples, Bounds, Snake>;
    };
  }
> {
  private snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  constructor(props: SnaaakeProps) {
    super(props);

    const { width, height, scale } = props;

    this.state = {
      game: {
        scale,
        state: {
          apples: [[10, 10]],
          bounds: createBounds({ width, height }),
          snake: [
            [0, 0],
            [0, 1],
            [1, 1],
          ],
        },
        status: 'idle',
      },
    };

    this.snakeMachine = createSnakeMachine<Apples, Bounds, Snake>({
      context: this.state.game.state,
      willExceedBounds,
      willEatApple,
      willHitItself,
      move: moveSnake,
      grow: growSnake,
      onUpdate: ({ context, state }) => {
        this.setState({
          game: {
            ...this.state.game,
            state: {
              ...this.state.game.state,
              apples: context.apples,
              snake: context.snake,
            },
            status: state,
          },
        });
      },
    });

    bindKeys({
      element: window,
      bindings: new Map([
        [
          [' '],
          {
            down: () => {
              this.snakeMachine.send('SPACE');
            },
            up: () => {},
          },
        ],
        [
          ['Escape'],
          {
            down: () => {
              this.snakeMachine.send('ESCAPE');
            },
            up: () => {},
          },
        ],
        [
          ['w', 'ArrowUp'],
          {
            down: () => {
              this.snakeMachine.send('UP');
            },
            up: () => {},
          },
        ],
        [
          ['d', 'ArrowRight'],
          {
            down: () => {
              this.snakeMachine.send('RIGHT');
            },
            up: () => {},
          },
        ],
        [
          ['s', 'ArrowDown'],
          {
            down: () => {
              this.snakeMachine.send('DOWN');
            },
            up: () => {},
          },
        ],
        [
          ['a', 'ArrowLeft'],
          {
            down: () => {
              this.snakeMachine.send('LEFT');
            },
            up: () => {},
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
    })();
  }

  render() {
    return (
      <div>
        <p>
          Current status: <b>{this.state.game.status}</b>
        </p>
        <Canvas
          width={
            this.state.game.state.bounds[
              this.state.game.state.bounds.length - 1
            ][0] *
              this.state.game.scale +
            this.state.game.scale
          }
          height={
            this.state.game.state.bounds[
              this.state.game.state.bounds.length - 1
            ][1] *
              this.state.game.scale +
            this.state.game.scale
          }
          state={this.state.game.state}
          scale={this.state.game.scale}
          draw={drawScene}
        />
      </div>
    );
  }
}
