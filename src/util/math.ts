export type Vec = {
  x: number;
  y: number;
};

export const createVec = (x: number, y: number): Vec => ({ x, y });
