import React from "react";

const Info: React.FC = () => {
  return (
    <div
      id="about"
      style={{
        float: "right",
        maxWidth: "600px",
        margin: "auto",
        padding: "1rem",
      }}
    >
      <h1>Second Order Elementary Cellular Automata</h1>
      Cellular automata are very interesting things. These are elementary
      cellular automata, starting from a random seed. You can try out different
      automata rules by typing a new number in the box (some favorites to try
      are 18, 30, and 184). If you select the &quot;Second order&quot; box you
      will see that same rule rendered in second order. For more information on
      what that means, check out this wikipedia article:{" "}
      <a href="https://en.wikipedia.org/wiki/Second-order_cellular_automaton">
        https://en.wikipedia.org/wiki/Second-order_cellular_automaton
      </a>
      <div id="footer">
        Made by <a href="http://jcmorrow.com">jcmorrow</a>
        <br />
        Check out the code on{" "}
        <a href="https://github.com/jcmorrow/second-order-automata">GitHub</a>
      </div>
    </div>
  );
};
export default Info;
