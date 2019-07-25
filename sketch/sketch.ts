// Rule 30
let rule = [0, 0, 0, 1, 1, 1, 1, 0];

// 18
rule = [0, 0, 0, 1, 0, 0, 1, 0];

// 110
rule = [0, 1, 1, 0, 1, 1, 1, 0];

// 184
// rule = [1, 0, 1, 1, 1, 0, 0, 0];

const CANVAS_WIDTH = 512;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
  let button = createButton("Step");
  button.position(CANVAS_WIDTH, CANVAS_WIDTH);
  button.mousePressed(draw);
  noLoop();
}

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

const bit_position_from_predecessors = (pattern: Array<number>) => {
  return PREDECESSORS.findIndex(p => String(p) == String(pattern));
};

const nextFromPredecessors = (predecessors: Array<number>) => {
  return rule[bit_position_from_predecessors(predecessors)];
};

// Pixel size is how big one cell will be in pixels
// CEll width is how many cells we will attempt to render (the upper limit is
// the actual HTML canvas size divided by the pixel size
const PIXEL_SIZE = 2;
const CELL_WIDTH = 256;

// Setting up some variables to generate the first 2d automata layout
let twoPrevRow = Array(CELL_WIDTH)
  .fill(0)
  .map(() => Math.round(Math.random()));
let prevRow = Array(CELL_WIDTH)
  .fill(0)
  .map(() => Math.round(Math.random()));

// Handy clamp function, returns a closure that will clamp between 0 and the
// given number. Positive numbers only.
const clamp = (x: number) => (i: number) => Math.max(0, Math.min(x - 1, i));
let c = clamp(CELL_WIDTH);

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

const render = (cells: Array<Array<number>>) => {
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        square(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE);
      }
    });
  });
};

let cells: Array<Array<number>> = range(CELL_WIDTH).map(y => {
  let newRow = range(CELL_WIDTH).map(x => {
    let firstOrder =
      rule[
        bit_position_from_predecessors([
          prevRow[c(x - 1)],
          prevRow[x],
          prevRow[c(x + 1)]
        ])
      ];
    let secondOrder = twoPrevRow[x];
    return firstOrder;
  });
  twoPrevRow = prevRow;
  prevRow = newRow;

  return newRow;
});

let twoGensAgoCells: Array<Array<number>> = range(CELL_WIDTH).map(y => {
  let newRow = range(CELL_WIDTH).map(x => {
    let firstOrder = nextFromPredecessors([
      prevRow[c(x - 1)],
      prevRow[x],
      prevRow[c(x + 1)]
    ]);
    let secondOrder = twoPrevRow[x];
    if (firstOrder) {
      return 1;
    } else {
      return 0;
    }
  });
  twoPrevRow = prevRow;
  prevRow = newRow;

  return newRow;
});

const iterate = (
  lastGen: Array<Array<number>>,
  twoGensAgo: Array<Array<number>>
) =>
  cells.map((row, x) =>
    row.map((cell, y) => {
      let firstOrder = nextFromPredecessors([
        cells[c(x)][c(y - 1)],
        cells[c(x)][c(y)],
        cells[c(x)][c(y + 1)]
      ]);
      let secondOrder = twoGensAgo[x][y];
      if (secondOrder != firstOrder) {
        return 1;
      } else {
        return 0;
      }
    })
  );

function draw() {
  clear();

  let newCells = iterate(cells, twoGensAgoCells);
  twoGensAgoCells = cells;
  cells = newCells;

  render(cells);

  noLoop();
}
