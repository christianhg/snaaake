import { isValidSnake, moveSnake } from './snake';

xdescribe(moveSnake.name, () => {
  it('works', () => {
    expect(moveSnake([], 'down')).toEqual([]);
    expect(moveSnake([[0, 0]], 'down')).toEqual([[0, 1]]);
    expect(
      moveSnake(
        [
          [0, 0],
          [0, 1],
        ],
        'down'
      )
    ).toEqual([
      [0, 1],
      [0, 2],
    ]);
    expect(
      moveSnake(
        [
          [0, 0],
          [0, 1],
          [1, 1],
        ],
        'down'
      )
    ).toEqual([
      [0, 1],
      [1, 1],
      [1, 2],
    ]);
    expect(
      moveSnake(
        [
          [0, 1],
          [1, 1],
          [1, 2],
        ],
        'up'
      )
    ).toEqual([
      [0, 1],
      [1, 1],
      [1, 2],
    ]);

    expect(moveSnake([[5, 5]], 'up')).toEqual([5, 6]);
  });
});

xdescribe(isValidSnake.name, () => {
  it('works', () => {
    expect(isValidSnake([])).toBeFalsy();
    expect(isValidSnake([[5, 5]])).toBeTruthy();
    expect(
      isValidSnake([
        [5, 5],
        [5, 6],
      ])
    ).toBeTruthy();
    expect(
      isValidSnake([
        [5, 5],
        [5, 6],
        [6, 6],
      ])
    ).toBeTruthy();
    expect(
      isValidSnake([
        [5, 5],
        [5, 6],
        [6, 6],
        [7, 6],
      ])
    ).toBeTruthy();
    expect(
      isValidSnake([
        [5, 5],
        [5, 6],
        [6, 6],
        [7, 6],
        [7, 5],
      ])
    ).toBeTruthy();
  });
});
