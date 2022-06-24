import * as utils from '.';

describe('utils/randomColor()', () => {
  it('generates a random color', () => {
    expect(/^#[0-9A-F]{6}$/i.test(utils.randomColor())).toBe(true);
  });
});
