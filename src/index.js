// import css file for css-loader & style-loader (do not delete)
import "./style.css";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";

const player1 = new Player();
const player2 = new Player();
player1.makePlayer("real");
player2.makePlayer("real");

player1.gameboard.placeShips("Carrier", 0, 0, "h");
player1.gameboard.placeShips("Battleship", 0, 3, "h");
player1.gameboard.placeShips("Cruiser", 0, 5, "h");
player1.gameboard.placeShips("Submarine", 0, 7, "h");
player1.gameboard.placeShips("Destroyer", 0, 9, "h");

player2.gameboard.placeShips("Carrier", 0, 0, "h");
player2.gameboard.placeShips("Battleship", 0, 3, "h");
player2.gameboard.placeShips("Cruiser", 0, 5, "h");
player2.gameboard.placeShips("Submarine", 0, 7, "h");
player2.gameboard.placeShips("Destroyer", 0, 9, "h");

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("New Game code that runs on page load goes here.");
});

function createGrid(rows, columns, container) {
  //clear previous grid, if exists
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      container.appendChild(cell);
    }
  }
}

const player1Div = document.querySelector(".gameboard-left");
const player2Div = document.querySelector(".gameboard-right");

createGrid(player1.gameboard.length, player1.gameboard.height, player1Div);
createGrid(player2.gameboard.length, player2.gameboard.height, player2Div);
