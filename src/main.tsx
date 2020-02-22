import 'modern-normalize';
import React, { Component } from 'react';
import { Canvas } from './canvas';
import { createEngine, Engine } from './engine';
import { createVec } from './math';
import {
  Bounds,
  Circle,
  createCircle,
  createSquare,
  updateCirclePos,
  updateCircleVel,
} from './shapes';
import { identity } from './util';
import { StateValue } from 'xstate';

type State = { bounds: Bounds; circle: Circle };

const tick = (state: State, step: number) => ({
  ...state,
  circle: updateCirclePos(updateCircleVel(state, step), step),
});

export class Snaaake extends Component<
  {},
  { game: { state: State; status: StateValue } }
> {
  private engine: Engine<State>;

  constructor(props: {}) {
    super(props);

    this.engine = createEngine({
      step: 1 / 60,
      tick,
      subscribe: ({ state, status }) =>
        this.setState({ game: { state, status } }),
      initialState: {
        circle: createCircle(20, createVec(320, 320), createVec(0, 0)),
        bounds: createSquare(createVec(0, 0), createVec(640, 640)),
      },
      keyBindings: {
        element: window,
        bindings: new Map([
          [
            ['w', 'ArrowUp'],
            {
              down: state => ({
                ...state,
                circle: {
                  ...state.circle,
                  vel: createVec(state.circle.vel.x, state.circle.vel.y - 1),
                },
              }),
              up: identity,
            },
          ],
          [
            ['d', 'ArrowRight'],
            {
              down: state => ({
                ...state,
                circle: {
                  ...state.circle,
                  vel: createVec(state.circle.vel.x + 1, state.circle.vel.y),
                },
              }),
              up: identity,
            },
          ],
          [
            ['s', 'ArrowDown'],
            {
              down: state => ({
                ...state,
                circle: {
                  ...state.circle,
                  vel: createVec(state.circle.vel.x, state.circle.vel.y + 1),
                },
              }),
              up: identity,
            },
          ],
          [
            ['a', 'ArrowLeft'],
            {
              down: state => ({
                ...state,
                circle: {
                  ...state.circle,
                  vel: createVec(state.circle.vel.x - 1, state.circle.vel.y),
                },
              }),
              up: identity,
            },
          ],
        ]),
      },
    });

    this.state = {
      game: {
        state: this.engine.getState(),
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
        <Canvas scene={this.state.game.state} />
      </div>
    );
  }
}
