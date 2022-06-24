import * as utils from '.';

describe('randomColor()', () => {
  it('generates a random color', () => {
    expect(/^#[0-9A-F]{6}$/i.test(utils.randomColor())).toBe(true);
  });
});
