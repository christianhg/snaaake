import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas } from './engine/canvas';
import { createEngine, Engine } from './engine/engine';
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

type State = { apples: Apples; bounds: Bounds; snake: Snake };

export class Snaaake extends Component<
  {},
  { game: { state: State; status: StateValue } }
> {
  private engine: Engine;
  private snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  constructor(props: {}) {
    super(props);

    this.state = {
      game: {
        state: {
          apples: [[10, 10]],
          bounds: createBounds({ width: 48, height: 48 }),
          snake: [
            [0, 0],
            [0, 1],
            [1, 1],
          ],
        },
        status: 'idle',
      },
    };

    let nextState: { apples: Apples; snake: Snake } = {
      apples: [[10, 10]],
      snake: [
        [0, 0],
        [0, 1],
        [1, 1],
      ],
    };

    this.snakeMachine = createSnakeMachine<Apples, Bounds, Snake>({
      context: this.state.game.state,
      willExceedBounds,
      willEatApple,
      willHitItself,
      move: moveSnake,
      grow: growSnake,
      onDead: () => {},
      onUpdate: ({ apples, snake }) => {
        nextState = { apples, snake };
      },
    });

    this.engine = createEngine({
      step: 1 / 8,
      onTick: () => {
        this.snakeMachine.send('TICK');
      },
      onUpdate: () => {
        this.setState({
          game: {
            ...this.state.game,
            state: {
              ...this.state.game.state,
              apples: nextState.apples,
              snake: nextState.snake,
            },
          },
        });
      },
      onStatusChanged: status => {
        this.setState({
          game: {
            ...this.state.game,
            status,
          },
        });
      },
      onStop: () => {
        this.snakeMachine.send('RESTART');
      },
      keyBindings: {
        element: window,
        bindings: new Map([
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
      },
    });
  }

  render() {
    return (
      <div>
        <p>
          Current status: <b>{this.state.game.status}</b>
        </p>
        {(this.state.game.status === 'idle' ||
          this.state.game.status === 'stopped') && (
          <button onClick={() => this.engine.start()}>Start</button>
        )}
        {this.state.game.status === 'running' && (
          <button onClick={() => this.engine.pause()}>Pause</button>
        )}
        {this.state.game.status === 'paused' && (
          <button onClick={() => this.engine.resume()}>Resume</button>
        )}
        {(this.state.game.status === 'running' ||
          this.state.game.status === 'paused') && (
          <button onClick={() => this.engine.stop()}>Stop</button>
        )}
        <Canvas
          width={
            this.state.game.state.bounds[
              this.state.game.state.bounds.length - 1
            ][0] *
              10 +
            10
          }
          height={
            this.state.game.state.bounds[
              this.state.game.state.bounds.length - 1
            ][1] *
              10 +
            10
          }
          state={this.state.game.state}
          draw={drawScene}
        />
      </div>
    );
  }
}
