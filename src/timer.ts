export const createTimer = ({ step, tick, getState, setState }) => () => {
  let lastTime = 0;
  let accumulatedTime = 0;
  let frameId;
  let state = getState();

  const animate = time => {
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
