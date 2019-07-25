// Rule 30. Obviously the best one.
let rule = [0, 0, 0, 1, 1, 1, 1, 0];

// 18 is good too.
rule = [0, 0, 0, 1, 0, 0, 1, 0];

// 110 is just life itself.
// rule = [0, 1, 1, 0, 1, 1, 1, 0];

// 184
// rule = [1, 0, 1, 1, 1, 0, 0, 0];

// p5 setup stuff
function setup() {
  createCanvas(2000, 2000);
  frameRate(1);
  let button = createButton("submit");
  button.position(0, 0);
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

// Pixel size is how big one cell will be in pixels
// Canvas width is how many cells we will attempt to render (the upper limit is
// the actual HTML canvas size divided by the pixel size
const PIXEL_SIZE = 2;
const CANVAS_WIDTH = 128;

// Setting up some variables to generate the first 2d automata layout
let twoPrevRow = Array(CANVAS_WIDTH)
  .fill(0)
  .map(() => !!Math.round(Math.random()));
let prevRow = Array(CANVAS_WIDTH)
  .fill(0)
  .map(() => !!Math.round(Math.random()));

// Handy clamp function, returns a closure that will clamp between 0 and the
// given number. Positive numbers only.
const clamp = (x: number) => (i: number) => Math.max(0, Math.min(x - 1, i));
let c = clamp(CANVAS_WIDTH);

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

const render = (cells: Array<Array<boolean>>) => {
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        point(x * PIXEL_SIZE, y * PIXEL_SIZE);
      }
    });
  });
};

let cells: Array<Array<boolean>> = range(CANVAS_WIDTH).map(y => {
  let newRow = range(CANVAS_WIDTH).map(x => {
    let firstOrder = !!rule[
      PREDECESSORS.findIndex(
        j =>
          !!j[0] == prevRow[c(x - 1)] &&
          !!j[1] == prevRow[x] &&
          !!j[2] == prevRow[c(x + 1)]
      )
    ];
    let secondOrder = twoPrevRow[x];
    return firstOrder;
  });
  twoPrevRow = prevRow;
  prevRow = newRow;

  return newRow;
});

let twoGensAgoCells = range(CANVAS_WIDTH).map(y => {
  let newRow = range(CANVAS_WIDTH).map(x => {
    let firstOrder = !!rule[
      PREDECESSORS.findIndex(
        j =>
          !!j[0] == prevRow[c(x - 1)] &&
          !!j[1] == prevRow[x] &&
          !!j[2] == prevRow[c(x + 1)]
      )
    ];
    let secondOrder = twoPrevRow[x];
    return firstOrder;
  });
  twoPrevRow = prevRow;
  prevRow = newRow;

  return newRow;
});

const iterate = (
  lastGen: Array<Array<boolean>>,
  twoGensAgo: Array<Array<boolean>>
) =>
  cells.map((row, x) =>
    row.map((cell, y) => {
      let firstOrder = !!rule[
        PREDECESSORS.findIndex(
          j =>
            !!j[0] == cells[c(x)][c(y - 1)] &&
            !!j[0] == cells[c(x)][c(y)] &&
            !!j[0] == cells[c(x)][c(y + 1)]
        )
      ];
      let secondOrder = twoGensAgo[x][y];
      if (secondOrder != firstOrder) {
        return true;
      } else {
        return false;
      }
    })
  );

function draw() {
  clear();

  let newCells = iterate(cells, twoGensAgoCells);
  twoGensAgoCells = cells;
  cells = newCells;

  render(cells);
}
