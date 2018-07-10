import { Vec } from './math'

export const createCircle = (radius, pos, vel) => ({
  pos,
  radius,
  vel,
})

export const createSquare = (A, C) => ({
  A,
  C,
})

export const updateCircleVel = ({ bounds, circle }, step) => ({
  ...circle,
  vel: Vec(
    updateCirclePos(circle, step).pos.x + circle.radius > bounds.C.x ||
    updateCirclePos(circle, step).pos.x - circle.radius < bounds.A.x
      ? -circle.vel.x
      : circle.vel.x,
    updateCirclePos(circle, step).pos.y + circle.radius > bounds.C.y ||
    updateCirclePos(circle, step).pos.y - circle.radius < bounds.A.y
      ? -circle.vel.y
      : circle.vel.y
  ),
})

export const updateCirclePos = (circle, step) => ({
  ...circle,
  pos: Vec(
    circle.pos.x + circle.vel.x * step,
    circle.pos.y + circle.vel.y * step
  ),
})
