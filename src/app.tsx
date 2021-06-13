import ReactDOM from "react-dom";
import React from "react";
import SecondOrderAutomataCanvas from "./second-order-automata-canvas";
import Info from "./info";

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{ display: "flex", justifyContent: "space-between", flexGrow: 1 }}
    >
      <SecondOrderAutomataCanvas />
      <Info />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
