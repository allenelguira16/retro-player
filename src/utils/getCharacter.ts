const charLookup: Record<string, string> = {};

const chars = [
  /* cspell:disable-next-line */
  "9765432EFGMYAHKBDPQWXNC9765432efgmyahkbdpqwxncvujzsrtLlI!i1'\"`^><|\\/}{][)(?!§¥£€$&80Oo@%#*+=;:~-,. "
    .split("")
    .reverse()
    .join(""),
  /* cspell:disable-next-line */
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. "
    .split("")
    .reverse()
    .join(""),
  /* cspell:disable-next-line */
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-                          "
    .split("")
    .reverse()
    .join(""),
  /* cspell:disable-next-line */
  "@#S$%?*+;:,. ".split("").reverse().join(""),
];

export const getCharacter = (r: number, g: number, b: number, i: number) => {
  const char = chars[i - 1];
  if (charLookup[`${r}-${g}-${b}`]) return charLookup[`${r}-${g}-${b}`];
  // Get Pixel Brightness
  // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  // Get Range of Brightness
  const range = (char.length - 1) / 255;
  // Map Character index from range ((e.g. map 32 from 1 to 256))
  const charIndex = Math.floor(brightness * range);
  // Append text
  charLookup[brightness] = char.charAt(charIndex);

  return charLookup[brightness];
};
