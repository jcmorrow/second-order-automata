import React, { useRef, useState, useEffect } from "react";

import { randomBinaryString, nextRow } from "./utils";

const CELL_WIDTH = 128;
const PIXEL_SIZE = 4;

// Setting up some variables to generate the first 2d automata layout
const twoPrevRow: Array<number> = randomBinaryString(CELL_WIDTH);
const prevRow: Array<number> = randomBinaryString(CELL_WIDTH);

const renderCanvas = (rows: number[][], canvas: CanvasRenderingContext2D) => {
  canvas.clearRect(0, 0, CELL_WIDTH * PIXEL_SIZE, CELL_WIDTH * PIXEL_SIZE);
  rows.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        canvas.strokeRect(
          x * PIXEL_SIZE,
          y * PIXEL_SIZE,
          PIXEL_SIZE,
          PIXEL_SIZE
        );
      }
    });
  });
};

const cells: Array<Array<number>> = [twoPrevRow, prevRow];

const SecondOrderAutomataCanvas: React.FC<Record<string, never>> = () => {
  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState({
    secondOrder: true,
    rule: 30,
    startTime: Date.now(),
  });
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const context = canvasRef?.current?.getContext("2d");

    if (context) {
      renderCanvas(cells, context);
    }
  }, [canvasRef, frame, state.rule]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setFrame(frame + 1);
    });
    if (cells.length > CELL_WIDTH) {
      cancelAnimationFrame(frameId);
      cells.shift();
    }
    const newCells = nextRow(
      cells[cells.length - 1],
      cells[cells.length - 2],
      state.secondOrder,
      state.rule
    );
    cells.push(newCells);
  }, [frame]);

  return (
    <>
      <canvas height="500" width="500" ref={canvasRef} />
      <button
        onClick={() =>
          setState({ ...state, rule: Math.round(Math.random() * 255) })
        }
      >
        Random Rule
      </button>
      <input
        type="checkbox"
        checked={state.secondOrder}
        onChange={(e) => setState({ ...state, secondOrder: e.target.checked })}
      />
      Second Order
    </>
  );
};

export default SecondOrderAutomataCanvas;
