import { faker } from '@faker-js/faker';

import * as utils from '.';

describe('utils#randomColor()', () => {
  it('generates a random color', () => {
    expect(/^#[0-9A-F]{6}$/i.test(utils.randomColor())).toBe(true);
  });
});

describe('utils#stringChunk()', () => {
  it('handles an empty string', () => {
    expect(utils.stringChunk('', 2)).toEqual([]);
  });

  it('splits a string in equally sized substrings', () => {
    const length = Math.floor(faker.datatype.number({ min: 10, max: 100 }) * 2);
    const str = faker.random.alpha(length);

    const chunkSize = 2;
    const chunks = utils.stringChunk(str, chunkSize);

    expect(chunks).toHaveLength(length / chunkSize);
    chunks.forEach((chunk) => {
      expect(chunk).toHaveLength(chunkSize);
    });
  });

  it('leaves the remaining items in the last chunk', () => {
    const str = faker.random.alpha(22);
    const chunkSize = 3;

    expect(utils.stringChunk(str, chunkSize).at(-1)).toHaveLength(
      str.length % chunkSize
    );
  });
});

describe('utils#hexToRGB', () => {
  it('throws an error when providing an invalid hex', () => {
    expect(() => {
      utils.hexToRGB('#fdsa');
    }).toThrowError('Invalid hex');
  });

  it('parses a hex color to an RGB array', () => {
    const color = '#ad57bd';
    expect(utils.hexToRGB(color)).toEqual([173, 87, 189]);
  });

  it('parses a shorthand hex color to an RGB array', () => {
    const color = '#fab';
    expect(utils.hexToRGB(color)).toEqual([255, 170, 187]);
  });
});

describe('utils#getContrastYIQ', () => {
  it('returns white when YIQ brightness is smaller than 128', () => {
    expect(utils.getContrastYIQ('#FFFFFF')).toBe('black');
  });

  it('returns black when YIQ brightness is bigger than or equal to 128', () => {
    expect(utils.getContrastYIQ('#000')).toBe('white');
  });
});
