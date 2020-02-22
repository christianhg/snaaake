type Timer = () => void;

export const createTimer = <State>({
  step,
  tick,
  getState,
  setState,
}: {
  step: number;
  tick: (state: State, step: number) => State;
  getState: () => State;
  setState: (state: State) => void;
}): Timer => () => {
  let lastTime = 0;
  let accumulatedTime = 0;
  let frameId: number;
  let state = getState();

  const animate = (time: number) => {
    state = getState();

    if (lastTime) {
      accumulatedTime = accumulatedTime + (time - lastTime) / 1000;

      while (accumulatedTime >= step) {
        accumulatedTime = accumulatedTime - step;

        state = tick(state, step);
      }
    }

    setState(state);

    lastTime = time;
    frameId = requestAnimationFrame(animate);
  };

  frameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(frameId);
};
