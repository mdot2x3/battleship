export function setupRender(player1, player2) {
  function createGrid(rows, columns, container) {
    //clear previous grid, if exists
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    for (let y = 1; y <= rows; y++) {
      for (let x = 1; x <= columns; x++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
      }
    }
  }

  function drawShips(array, container) {
    array.forEach(([x, y]) => {
      if (x <= 10 && y <= 10 && x >= 1 && y >= 1) {
        const allCells = container.querySelectorAll(".grid-cell");
        allCells.forEach((cell) => {
          if (Number(cell.dataset.x) === x && Number(cell.dataset.y) === y) {
            cell.style.backgroundColor = "black";
          }
        });
      } else {
        throw new Error("Ships can not be placed outside the gameboard.");
      }
    });
  }

  const player1Div = document.querySelector(".gameboard-left");
  const player2Div = document.querySelector(".gameboard-right");

  createGrid(player1.gameboard.length, player1.gameboard.height, player1Div);
  createGrid(player2.gameboard.length, player2.gameboard.height, player2Div);

  const player1ShipCoords = [
    player1.gameboard.shipOneCoordinates,
    player1.gameboard.shipTwoCoordinates,
    player1.gameboard.shipThreeCoordinates,
    player1.gameboard.shipFourCoordinates,
    player1.gameboard.shipFiveCoordinates,
  ];
  for (let i = 0; i < player1ShipCoords.length; i++) {
    drawShips(player1ShipCoords[i], player1Div);
  }

  const player2ShipCoords = [
    player2.gameboard.shipOneCoordinates,
    player2.gameboard.shipTwoCoordinates,
    player2.gameboard.shipThreeCoordinates,
    player2.gameboard.shipFourCoordinates,
    player2.gameboard.shipFiveCoordinates,
  ];
  for (let i = 0; i < player2ShipCoords.length; i++) {
    drawShips(player2ShipCoords[i], player2Div);
  }
}
