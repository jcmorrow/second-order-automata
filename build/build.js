var rule = [0, 0, 0, 1, 1, 1, 1, 0];
rule = [0, 0, 0, 1, 0, 0, 1, 0];
rule = [0, 1, 1, 0, 1, 1, 1, 0];
var CANVAS_WIDTH = 512;
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
    var button = createButton("Step");
    button.position(CANVAS_WIDTH, CANVAS_WIDTH);
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
var bit_position_from_predecessors = function (pattern) {
    return PREDECESSORS.findIndex(function (p) { return String(p) == String(pattern); });
};
var nextFromPredecessors = function (predecessors) {
    return rule[bit_position_from_predecessors(predecessors)];
};
var PIXEL_SIZE = 2;
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
var cells = range(CELL_WIDTH).map(function (y) {
    var newRow = range(CELL_WIDTH).map(function (x) {
        var firstOrder = rule[bit_position_from_predecessors([
            prevRow[c(x - 1)],
            prevRow[x],
            prevRow[c(x + 1)]
        ])];
        var secondOrder = twoPrevRow[x];
        return firstOrder;
    });
    twoPrevRow = prevRow;
    prevRow = newRow;
    return newRow;
});
var twoGensAgoCells = range(CELL_WIDTH).map(function (y) {
    var newRow = range(CELL_WIDTH).map(function (x) {
        var firstOrder = nextFromPredecessors([
            prevRow[c(x - 1)],
            prevRow[x],
            prevRow[c(x + 1)]
        ]);
        var secondOrder = twoPrevRow[x];
        if (firstOrder) {
            return 1;
        }
        else {
            return 0;
        }
    });
    twoPrevRow = prevRow;
    prevRow = newRow;
    return newRow;
});
var iterate = function (lastGen, twoGensAgo) {
    return cells.map(function (row, x) {
        return row.map(function (cell, y) {
            var firstOrder = nextFromPredecessors([
                cells[c(x)][c(y - 1)],
                cells[c(x)][c(y)],
                cells[c(x)][c(y + 1)]
            ]);
            var secondOrder = twoGensAgo[x][y];
            if (secondOrder != firstOrder) {
                return 1;
            }
            else {
                return 0;
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
    noLoop();
}
//# sourceMappingURL=build.js.map