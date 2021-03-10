export function getRandomItem<A>(xs: ReadonlyArray<A>): A | undefined {
  return xs.length > 0 ? xs[Math.floor(Math.random() * xs.length)] : undefined;
}
