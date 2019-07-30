const CANVAS_WIDTH = 512;
const PIXEL_SIZE = 4;
const CELL_WIDTH = 128;
const toBinary = (i) => {
    return (i >>> 0)
        .toString(2)
        .padStart(8, "0")
        .split("")
        .map((x) => parseInt(x));
};
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
const nextFromPredecessorsBitwise = (predecessors) => {
    let predsAsNumber = predecessors[0] * 4 + predecessors[1] * 2 + predecessors[2] * 1;
    return (2 ** predsAsNumber) & window.rule;
};
const bitPositionFromPredecessors = (pattern) => {
    return PREDECESSORS.findIndex(p => String(p) == String(pattern));
};
const nextFromPredecessors = (predecessors) => {
    return toBinary(window.rule)[bitPositionFromPredecessors(predecessors)];
};
const randomBinaryString = (length) => Array(length)
    .fill(0)
    .map(() => Math.round(Math.random()));
const range = (x) => {
    let counter = 0;
    let result = [];
    while (counter < x) {
        result.push(counter);
        counter = counter + 1;
    }
    return result;
};
const clamp = (x) => (i) => Math.max(0, Math.min(x - 1, i));
let c = clamp(CELL_WIDTH);
window.rule = 30;
let twoPrevRow = randomBinaryString(CELL_WIDTH);
let prevRow = randomBinaryString(CELL_WIDTH);
const render = (cells) => {
    cells.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                square(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE);
                fill(200, 200, 200);
            }
        });
    });
};
let cells = [twoPrevRow, prevRow];
const iterate = (lastGen, twoGensAgo, useSecondOrder) => lastGen.map((x, i) => {
    let firstOrder = nextFromPredecessorsBitwise([
        lastGen[c(i - 1)],
        lastGen[c(i)],
        lastGen[c(i + 1)]
    ]);
    let secondOrder = twoGensAgo[i];
    if (useSecondOrder) {
        if (secondOrder != firstOrder) {
            return 1;
        }
        else {
            return 0;
        }
    }
    else {
        if (firstOrder) {
            return 1;
        }
        else {
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
    let newCells = iterate(cells[cells.length - 1], cells[cells.length - 2], window.secondOrder);
    if (cells.length > CELL_WIDTH) {
        cells.shift();
    }
    render(cells);
}
//# sourceMappingURL=build.js.map