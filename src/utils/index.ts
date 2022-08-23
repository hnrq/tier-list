export const stringChunk = (str: string, size: number): string[] => {
  const numChunks: number = Math.ceil(str.length / size);
  const chunks: string[] = new Array(numChunks);

  for (let i = 0, offset = 0; i < numChunks; ++i, offset += size) {
    chunks[i] = str.substring(offset, offset + size);
  }

  return chunks;
};

export const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

export const hexToRGB = (hexColor: string) => {
  const hex = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
  if (hex.length !== 3 && hex.length !== 6) throw new Error('Invalid hex');
  const fullHex = hex.length === 6;

  return stringChunk(hex, fullHex ? 2 : 1).map((value) =>
    parseInt(fullHex ? value : `${value}${value}`, 16)
  );
};

export const getContrastYIQ = (hexColor: string): 'black' | 'white' => {
  const rgb = hexToRGB(hexColor);
  const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};
