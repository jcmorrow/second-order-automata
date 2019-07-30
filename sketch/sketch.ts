// Pixel size is how big one cell will be in pixels
// CEll width is how many cells we will attempt to render (the upper limit is
// the actual HTML canvas size divided by the pixel size
const CANVAS_WIDTH = 512;
const PIXEL_SIZE = 4;
const CELL_WIDTH = 128;

const toBinary = (i: number) => {
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
  [0, 0, 0]
];

const nextFromPredecessorsBitwise = (predecessors: Array<number>) => {
  let predsAsNumber =
    predecessors[0] * 4 + predecessors[1] * 2 + predecessors[2] * 1;
  return (2 ** predsAsNumber) & (window as any).rule;
};

const bitPositionFromPredecessors = (pattern: Array<number>) => {
  return PREDECESSORS.findIndex(p => String(p) == String(pattern));
};

const nextFromPredecessors = (predecessors: Array<number>) => {
  return toBinary((window as any).rule)[
    bitPositionFromPredecessors(predecessors)
  ];
};

const randomBinaryString = (length: number) =>
  Array(length)
    .fill(0)
    .map(() => Math.round(Math.random()));

// Annoying that we don't have this function in JS otherwise
const range = (x: number) => {
  let counter = 0;
  let result = [];
  while (counter < x) {
    result.push(counter);
    counter = counter + 1;
  }
  return result;
};

// Handy clamp function, returns a closure that will clamp between 0 and the
// given number. Positive numbers only.
const clamp = (x: number) => (i: number) => Math.max(0, Math.min(x - 1, i));
let c = clamp(CELL_WIDTH);

(window as any).rule = 30;

// Setting up some variables to generate the first 2d automata layout
let twoPrevRow: Array<number> = randomBinaryString(CELL_WIDTH);
let prevRow: Array<number> = randomBinaryString(CELL_WIDTH);

const render = (cells: Array<Array<number>>) => {
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        square(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE);
        fill(200, 200, 200);
      }
    });
  });
};

let cells: Array<Array<number>> = [twoPrevRow, prevRow];

const iterate = (
  lastGen: Array<number>,
  twoGensAgo: Array<number>,
  useSecondOrder: boolean
) =>
  lastGen.map((x, i) => {
    let firstOrder = nextFromPredecessorsBitwise([
      lastGen[c(i - 1)],
      lastGen[c(i)],
      lastGen[c(i + 1)]
    ]);
    let secondOrder = twoGensAgo[i];
    if (useSecondOrder) {
      if (secondOrder != firstOrder) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (firstOrder) {
        return 1;
      } else {
        return 0;
      }
    }
  });

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
  canvas.parent("#automata");
}

function draw() {
  clear();

  let newCells = iterate(
    cells[cells.length - 1],
    cells[cells.length - 2],
    (window as any).secondOrder
  );

  if (cells.length > CELL_WIDTH) {
    cells.shift();
  }

  render(cells);
}
