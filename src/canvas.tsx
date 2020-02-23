import React, { Component } from 'react';

const drawCircle = colorCircle => context => ({ pos, radius }) => {
  context.strokeStyle = colorCircle({ pos, radius });
  context.beginPath();
  context.lineWidth = 2;
  context.arc(pos.x, pos.y, radius - 1, 0, Math.PI * 2);
  context.closePath();
  context.stroke();
};

export class Canvas extends Component {
  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    context.clearRect(
      this.props.scene.bounds.A.x,
      this.props.scene.bounds.A.y,
      this.props.scene.bounds.C.x,
      this.props.scene.bounds.C.y
    );
    context.fillStyle = '#000000';

    drawCircle(() => '#ffffff')(context)(this.props.scene.circle);
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width={this.props.scene.bounds.C.x}
        height={this.props.scene.bounds.C.y}
      />
    );
  }
}
