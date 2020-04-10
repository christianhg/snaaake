export function getRandomItem<A>(xs: ReadonlyArray<A>): A {
  return xs[Math.floor(Math.random() * xs.length)];
}
