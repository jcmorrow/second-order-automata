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

const SecondOrderAutomataCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, setState] = useState({
    rule: 30,
    scroll: true,
    secondOrder: true,
    startTime: Date.now(),
  });
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const context = canvasRef?.current?.getContext("2d");

    if (context) {
      renderCanvas(cells, context);
    }
  }, [canvasRef, frame]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setFrame(frame + 1);
    });
    if (cells.length > CELL_WIDTH) {
      if (!state.scroll) {
        cancelAnimationFrame(frameId);
      }
      cells.shift();
    }
    const newCells = nextRow(
      cells[cells.length - 1],
      cells[cells.length - 2],
      state.secondOrder,
      state.rule
    );
    cells.push(newCells);
  }, [frame, state.scroll]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <canvas height="500" width="500" ref={canvasRef} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
        }}
      >
        <button
          onClick={() =>
            setState({ ...state, rule: Math.round(Math.random() * 255) })
          }
        >
          Random Rule
        </button>
        <label>
          <input
            type="checkbox"
            style={{ verticalAlign: "middle", marginRight: "5px" }}
            checked={state.secondOrder}
            onChange={(e) =>
              setState({ ...state, secondOrder: e.target.checked })
            }
          />
          Second Order
        </label>
        <label>
          <input
            style={{ verticalAlign: "middle", marginRight: "5px" }}
            type="checkbox"
            checked={state.scroll}
            onChange={(e) => setState({ ...state, scroll: e.target.checked })}
          />
          Scroll
        </label>
        <input
          type="text"
          value={state.rule}
          onChange={(e) => {
            const newRule = parseInt(e.target.value);
            if (!isNaN(newRule)) {
              setState({ ...state, rule: newRule });
            } else {
              setState({ ...state, rule: undefined });
            }
          }}
        />
      </div>
    </div>
  );
};

export default SecondOrderAutomataCanvas;
