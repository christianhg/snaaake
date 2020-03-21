type Timer = () => void;

export const createTimer = <State>({
  step,
  onTick,
}: {
  step: number;
  onTick: () => void;
}): Timer => () => {
  let accumulatedTime = 0;
  let lastTime = 0;

  const animate = (time: number = 0) => {
    accumulatedTime += (time - lastTime) / 1000;

    while (accumulatedTime > step) {
      onTick();

      accumulatedTime = accumulatedTime - step;
    }

    lastTime = time;

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};
