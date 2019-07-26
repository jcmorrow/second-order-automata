var rule = [0, 0, 0, 1, 1, 1, 1, 0];
rule = [0, 0, 0, 1, 0, 0, 1, 0];
var CANVAS_WIDTH = 1024;
var toBinary = function (i) {
    return (i >>> 0)
        .toString(2)
        .padStart(8, "0")
        .split("")
        .map(function (x) { return parseInt(x); });
};
console.log(rule);
console.log(toBinary(30));
var checkbox;
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
    frameRate(5);
}
var PREDECESSORS = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 0],
    [0, 1, 1],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0]
];
var bit_position_from_predecessors = function (pattern) {
    return PREDECESSORS.findIndex(function (p) { return String(p) == String(pattern); });
};
var nextFromPredecessors = function (predecessors) {
    return rule[bit_position_from_predecessors(predecessors)];
};
var PIXEL_SIZE = 4;
var CELL_WIDTH = 256;
var twoPrevRow = Array(CELL_WIDTH)
    .fill(0)
    .map(function () { return Math.round(Math.random()); });
var prevRow = Array(CELL_WIDTH)
    .fill(0)
    .map(function () { return Math.round(Math.random()); });
var clamp = function (x) { return function (i) { return Math.max(0, Math.min(x - 1, i)); }; };
var c = clamp(CELL_WIDTH);
var range = function (x) {
    var counter = 0;
    var result = [];
    while (counter < x) {
        result.push(counter);
        counter = counter + 1;
    }
    return result;
};
var render = function (cells) {
    cells.forEach(function (row, y) {
        row.forEach(function (cell, x) {
            if (cell) {
                square(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE);
            }
        });
    });
};
var cells = [twoPrevRow, prevRow];
var iterate = function (lastGen, twoGensAgo, useSecondOrder) {
    return lastGen.map(function (x, i) {
        var firstOrder = nextFromPredecessors([
            lastGen[c(i - 1)],
            lastGen[c(i)],
            lastGen[c(i + 1)]
        ]);
        var secondOrder = twoGensAgo[i];
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
};
function draw() {
    clear();
    var newCells = iterate(cells[cells.length - 1], cells[cells.length - 2], window.secondOrder);
    console.log(newCells);
    cells.push(newCells);
    render(cells);
}
//# sourceMappingURL=build.js.map