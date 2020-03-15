type Timer = () => () => void;

export const createTimer = <State>({
  step,
  onTick,
  onUpdate,
}: {
  step: number;
  onTick: () => void;
  onUpdate: () => void;
}): Timer => () => {
  let lastTime = 0;
  let accumulatedTime = 0;
  let frameId: number;

  const animate = (time: number) => {
    if (lastTime) {
      accumulatedTime = accumulatedTime + (time - lastTime) / 1000;

      while (accumulatedTime >= step) {
        accumulatedTime = accumulatedTime - step;

        onTick();
      }
    }

    onUpdate();

    lastTime = time;
    frameId = requestAnimationFrame(animate);
  };

  frameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(frameId);
};
