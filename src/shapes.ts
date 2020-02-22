import { createVec, Vec } from './math';

type Pos = {
  x: number;
  y: number;
};

export type Circle = {
  pos: Pos;
  radius: number;
  vel: Vec;
};

export const createCircle = (radius: number, pos: Pos, vel: Vec): Circle => ({
  pos,
  radius,
  vel,
});

type Square = {
  A: Pos;
  C: Pos;
};

export const createSquare = (A: Pos, C: Pos): Square => ({
  A,
  C,
});

export type Bounds = {
  A: Pos;
  C: Pos;
};

export const updateCircleVel = (
  { bounds, circle }: { bounds: Bounds; circle: Circle },
  step: number
): Circle => ({
  ...circle,
  vel: createVec(
    updateCirclePos(circle, step).pos.x + circle.radius > bounds.C.x ||
      updateCirclePos(circle, step).pos.x - circle.radius < bounds.A.x
      ? -circle.vel.x
      : circle.vel.x,
    updateCirclePos(circle, step).pos.y + circle.radius > bounds.C.y ||
      updateCirclePos(circle, step).pos.y - circle.radius < bounds.A.y
      ? -circle.vel.y
      : circle.vel.y
  ),
});

export const updateCirclePos = (circle: Circle, step: number): Circle => ({
  ...circle,
  pos: createVec(
    circle.pos.x + circle.vel.x * step,
    circle.pos.y + circle.vel.y * step
  ),
});
