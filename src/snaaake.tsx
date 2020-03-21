import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas } from './engine/canvas';
import { StateValue } from 'xstate';
import { SnakeMachine, createSnakeMachine } from './snake/snake-machine';
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

type State = { apples: Apples; bounds: Bounds; snake: Snake };

export class Snaaake extends Component<
  {},
  { game: { scale: number; state: State; status: StateValue } }
> {
  private snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  constructor(props: {}) {
    super(props);

    this.state = {
      game: {
        scale: 20,
        state: {
          apples: [[10, 10]],
          bounds: createBounds({ width: 24, height: 24 }),
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
            state: context,
            // status: state
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
