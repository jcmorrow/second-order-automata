// Pixel size is how big one cell will be in pixels
// CEll width is how many cells we will attempt to render (the upper limit is
// the actual HTML canvas size divided by the pixel size

export const toBinary = (i: number): number[] => {
  return (i >>> 0)
    .toString(2)
    .padStart(8, "0")
    .split("")
    .map((x: string) => parseInt(x));
};

// Which bit should we be looking at? These come from the elementary cellular
// automata rules
const PREDECESSORS = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, 0],
  [0, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0],
];

export const bitPositionFromPredecessors = (pattern: Array<number>): number => {
  return PREDECESSORS.findIndex((p) => String(p) == String(pattern));
};

export const nextFromPredecessors = (
  predecessors: Array<number>,
  rule: number
): number => {
  return toBinary(rule)[bitPositionFromPredecessors(predecessors)];
};

export const randomBinaryString = (length: number): number[] =>
  Array(length)
    .fill(0)
    .map(() => Math.round(Math.random()));

// Annoying that we don't have this function in JS otherwise
export const range = (x: number): number[] => {
  let counter = 0;
  const result = [];
  while (counter < x) {
    result.push(counter);
    counter = counter + 1;
  }
  return result;
};

// Handy clamp function, returns a closure that will clamp between 0 and the
// given number. Positive numbers only.
export const clamp = (x: number) => (i: number): number =>
  Math.max(0, Math.min(x - 1, i));
