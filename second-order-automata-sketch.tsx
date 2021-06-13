import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import { randomBinaryString, nextFromPredecessors, clamp } from "./utils";

const CELL_WIDTH = 256;
const PIXEL_SIZE = 4;
export const c = clamp(CELL_WIDTH);

// Setting up some variables to generate the first 2d automata layout
const twoPrevRow: Array<number> = randomBinaryString(CELL_WIDTH);
const prevRow: Array<number> = randomBinaryString(CELL_WIDTH);

const render = (rows: Array<Array<number>>, p: p5Types) => {
  rows.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        if (Math.random() > 0.0) {
          p.square(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE);
          // p.fill(200, 200, 200);
        }
      }
    });
  });
};

const cells: Array<Array<number>> = [twoPrevRow, prevRow];

const iterate = (
  lastGen: Array<number>,
  twoGensAgo: Array<number>,
  useSecondOrder: boolean,
  rule: number
) =>
  lastGen.map((_x, i) => {
    const firstOrder = nextFromPredecessors(
      [lastGen[c(i - 1)], lastGen[c(i)], lastGen[c(i + 1)]],
      rule
    );
    const secondOrder = twoGensAgo[i];
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

const SecondOrderAutomataSketch: React.FC<Record<string, never>> = () => {
  const [state] = useState({ secondOrder: true, rule: 30 });

  const setup = (p: p5Types, canvasParentRef: Element) => {
    p.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p: p5Types) => {
    p.clear();

    // const newCells = iterate(
    //   cells[cells.length - 1],
    //   cells[cells.length - 2],
    //   state.secondOrder,
    //   state.rule
    // );
    if (cells.length > CELL_WIDTH) {
      // cells.shift();
      p.noLoop();
    }
    cells.push(randomBinaryString(CELL_WIDTH));

    render(cells, p);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default SecondOrderAutomataSketch;
