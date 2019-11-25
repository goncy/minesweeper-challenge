import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import "./styles.css";

const Board = styled.div`
  display: grid;
  grid-template: repeat(8, 64px) / repeat(8, 64px);
  grid-gap: 6px;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gainsboro;
  border-radius: 4px;
  font-size: 24px;
  background: ${({ children, shown }) =>
    shown ? (children === "💣" ? "tomato" : "whitesmoke") : "transparent"};
  color: ${({ children, shown }) =>
    shown
      ? children === 0
        ? "transparent"
        : children === 1
        ? "green"
        : children === 2
        ? "orange"
        : children === 3
        ? "red"
        : "black"
      : "transparent"};
`;

function getLenses(index, gridSize) {
  return [
    index % gridSize === 0 ? -1 : index - 1,
    (index + 1) % gridSize === 0 ? -1 : index + 1,
    index + gridSize > gridSize ** 2 ? -1 : index + gridSize,
    index - gridSize < 0 ? -1 : index - gridSize,
    index % gridSize === 0 ? -1 : index - (gridSize + 1),
    index % gridSize === 0 ? -1 : index + (gridSize - 1),
    (index + 1) % gridSize === 0 ? -1 : index + (gridSize + 1),
    (index + 1) % gridSize === 0 ? -1 : index - (gridSize - 1)
  ];
}

function getBombs(gridSize) {
  return Array(gridSize)
    .fill(true)
    .map(() => Math.floor(Math.random() * gridSize ** 2));
}

function App() {
  const [gridSize] = React.useState(8);
  const [bombs, setBombs] = React.useState(() => new Set(getBombs(gridSize)));
  const [shown, setShown] = React.useState(() => new Set());
  const [moves, setMoves] = React.useState(0);

  function reset() {
    setShown(new Set());
    setBombs(new Set(getBombs(gridSize)));
    setMoves(0);
  }

  function reveal() {
    setShown(
      new Set(
        Array(gridSize * gridSize)
          .fill(true)
          .map((_, i) => i)
      )
    );
  }

  function handleClick(index) {
    if (!shown.has(index)) {
      setMoves(moves => moves + 1);

      shown.add(index);

      if (bombs.has(index)) {
        alert("You lost!");
        reveal();
      }

      if (moves === gridSize ** 2 - gridSize - 1) {
        alert("You won!");
        reveal();
      }
    }
  }

  return (
    <>
      <h1>Moves: {moves}</h1>
      <h3>
        <button onClick={reset}>Reset</button>
      </h3>
      <Board>
        {Array(gridSize ** 2)
          .fill(true)
          .map((_, index) => (
            <Cell
              key={index}
              shown={shown.has(index)}
              onClick={() => handleClick(index)}
            >
              {bombs.has(index)
                ? "💣"
                : getLenses(index, gridSize).reduce(
                    (count, cell) => (bombs.has(cell) ? count + 1 : count),
                    0
                  )}
            </Cell>
          ))}
      </Board>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
