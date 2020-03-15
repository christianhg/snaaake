import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas } from './engine/canvas';
import { createEngine, Engine } from './engine/engine';
import { StateValue } from 'xstate';
import { SnakeMachine, createSnakeMachine } from './snake-machine';
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
} from './snake';

type State = { apples: Apples; bounds: Bounds; snake: Snake };

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

function drawScene(scene: State, context: CanvasRenderingContext2D): void {
  context.clearRect(
    scene.bounds[0][0],
    scene.bounds[0][1],
    scene.bounds[scene.bounds.length - 1][0] * 10,
    scene.bounds[scene.bounds.length - 1][1] * 10
  );
  context.fillStyle = '#000000';

  drawSnake(scene.snake, context);
  drawApples(scene.apples, context);
}

export class Snaaake extends Component<
  {},
  { game: { state: State; status: StateValue } }
> {
  private engine: Engine;
  private snakeMachine: SnakeMachine<Apples, Bounds, Snake>;

  constructor(props: {}) {
    super(props);

    const initialState: State = {
      apples: [[10, 10]],
      bounds: createBounds({ width: 48, height: 48 }),
      snake: [
        [0, 0],
        [0, 1],
        [1, 1],
      ],
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
      context: initialState,
      willExceedBounds,
      willEatApple,
      willHitItself,
      move: moveSnake,
      grow: growSnake,
      onDead: () => {},
      onUpdate: ({ apples, snake }) => {
        nextState = { apples, snake };
        // this.setState({ game: {
        //   ...this.state.game,
        //   state: {
        //     ...this.state.game.state,
        //     apples,
        //     snake
        //   }
        // }})
      },
    });

    this.engine = createEngine({
      step: 1 / 4,
      onTick: () => {
        this.snakeMachine.send('TICK');
      },
      onUpdate: status => {
        this.setState({
          game: {
            ...this.state.game,
            status,
            state: {
              ...this.state.game.state,
              apples: nextState.apples,
              snake: nextState.snake,
            },
          },
        });
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

    this.state = {
      game: {
        state: initialState,
        status: this.engine.getStatus(),
      },
    };
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
            ][0] * 10
          }
          height={
            this.state.game.state.bounds[
              this.state.game.state.bounds.length - 1
            ][1] * 10
          }
          state={this.state.game.state}
          draw={drawScene}
        />
      </div>
    );
  }
}
