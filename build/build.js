var rule = [0, 0, 0, 1, 1, 1, 1, 0];
rule = [0, 0, 0, 1, 0, 0, 1, 0];
function setup() {
    createCanvas(2000, 2000);
    frameRate(1);
    var button = createButton("submit");
    button.position(0, 0);
    button.mousePressed(draw);
    noLoop();
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
var PIXEL_SIZE = 2;
var CANVAS_WIDTH = 128;
var twoPrevRow = Array(CANVAS_WIDTH)
    .fill(0)
    .map(function () { return !!Math.round(Math.random()); });
var prevRow = Array(CANVAS_WIDTH)
    .fill(0)
    .map(function () { return !!Math.round(Math.random()); });
var clamp = function (x) { return function (i) { return Math.max(0, Math.min(x - 1, i)); }; };
var c = clamp(CANVAS_WIDTH);
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
                point(x * PIXEL_SIZE, y * PIXEL_SIZE);
            }
        });
    });
};
var cells = range(CANVAS_WIDTH).map(function (y) {
    var newRow = range(CANVAS_WIDTH).map(function (x) {
        var firstOrder = !!rule[PREDECESSORS.findIndex(function (j) {
            return !!j[0] == prevRow[c(x - 1)] &&
                !!j[1] == prevRow[x] &&
                !!j[2] == prevRow[c(x + 1)];
        })];
        var secondOrder = twoPrevRow[x];
        return firstOrder;
    });
    twoPrevRow = prevRow;
    prevRow = newRow;
    return newRow;
});
var twoGensAgoCells = range(CANVAS_WIDTH).map(function (y) {
    var newRow = range(CANVAS_WIDTH).map(function (x) {
        var firstOrder = !!rule[PREDECESSORS.findIndex(function (j) {
            return !!j[0] == prevRow[c(x - 1)] &&
                !!j[1] == prevRow[x] &&
                !!j[2] == prevRow[c(x + 1)];
        })];
        var secondOrder = twoPrevRow[x];
        return firstOrder;
    });
    twoPrevRow = prevRow;
    prevRow = newRow;
    return newRow;
});
var iterate = function (lastGen, twoGensAgo) {
    return cells.map(function (row, x) {
        return row.map(function (cell, y) {
            var firstOrder = !!rule[PREDECESSORS.findIndex(function (j) {
                return !!j[0] == cells[c(x)][c(y - 1)] &&
                    !!j[0] == cells[c(x)][c(y)] &&
                    !!j[0] == cells[c(x)][c(y + 1)];
            })];
            var secondOrder = twoGensAgo[x][y];
            if (secondOrder != firstOrder) {
                return true;
            }
            else {
                return false;
            }
        });
    });
};
function draw() {
    clear();
    var newCells = iterate(cells, twoGensAgoCells);
    twoGensAgoCells = cells;
    cells = newCells;
    render(cells);
}
//# sourceMappingURL=build.js.map