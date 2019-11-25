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
  transition: all 0.5s;
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
    index + gridSize > gridSize * gridSize ? -1 : index + gridSize,
    index - gridSize < 0 ? -1 : index - gridSize,
    index % gridSize === 0 ? -1 : index - (gridSize + 1),
    index % gridSize === 0 ? -1 : index + (gridSize + 1),
    index % gridSize === 0 ? -1 : index + (gridSize - 1),
    (index + 1) % gridSize === 0 ? -1 : index - (gridSize - 1)
  ];
}

function App() {
  const [gridSize] = React.useState(8);
  const [bombs] = React.useState(() => new Set([0, 4, 7, 16]));
  const [shown, setShown] = React.useState(() => new Set([]));
  const [moves, setMoves] = React.useState(0);

  function handleClick(index) {
    if (!shown.has(index)) {
      shown.add(index);
      setMoves(moves => moves + 1);

      if (bombs.has(index)) {
        alert("You lost!");
        setShown(
          new Set(
            Array(gridSize * gridSize)
              .fill(true)
              .map((_, i) => i)
          )
        );
      }
    }
  }

  return (
    <>
      <h1>Moves: {moves}</h1>
      <Board>
        {Array(gridSize * gridSize)
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
