import {
  drawShipPreview,
  clearShipVisuals,
  drawShips,
  updateGameText,
  showError,
} from "./render.js";

const domContent = document.querySelector(".dom-content");
const player1Div = document.querySelector(".gameboard-left");
const player2Div = document.querySelector(".gameboard-right");

export function newGame(player1, player2) {
  updateGameText(`
    <p>Click to Start: </p>
    <button class="new-button">New Game</button>
  `);
  const newButton = document.querySelector(".new-button");
  newButton.addEventListener("click", () => setupGame(player1, player2));
}

export function setupGame(player1, player2) {
  const shipList = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ];
  let currentShipIndex = 0;
  let currentOrientation = "h";
  let currentHeadCell = null;

  let currentPlayer = player1;
  let currentPlayerString = "Player 1";
  let boardSelector = ".gameboard-left";
  let boardDiv = player1Div;

  function updatePlacementText() {
    updateGameText(`
      <p>${currentPlayerString}, place your ${shipList[currentShipIndex]} on the board.</p>
      <p>Click again to rotate. Click elsewhere to move. Confirm placement when ready.</p>
      <button class="confirm-button">Confirm</button>
    `);
    document.querySelector(".confirm-button").onclick = confirmPlacement;
  }

  // helper function to clear error messages
  function clearError() {
    const gameText = document.querySelector(".game-text");
    // remove only error messages, not instructions/buttons
    gameText.querySelectorAll(".error-message").forEach((p) => p.remove());
  }

  function handlePreviewClick(event) {
    clearError();
    if (!event.target.classList.contains("grid-cell")) return;

    // only allow clicks on the current player's board
    if (
      !event.target.parentElement.classList.contains(
        boardSelector.replace(".", ""),
      )
    )
      return;

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    // toggle orientation if clicking the same cell, otherwise reset orientation
    if (currentHeadCell && currentHeadCell.x === x && currentHeadCell.y === y) {
      currentOrientation = currentOrientation === "h" ? "v" : "h";
    } else {
      currentHeadCell = { x, y };
      currentOrientation = "h";
    }
    drawShipPreview(
      x,
      y,
      currentOrientation,
      [5, 4, 3, 3, 2][currentShipIndex],
      boardSelector,
    );
  }

  function confirmPlacement() {
    // clear previous error message, if exists
    clearError();
    // prevent user confirming without selecting a cell
    if (!currentHeadCell) {
      showError("Please select a cell to place your ship.", confirmPlacement);
      return;
    }
    try {
      // attempt to place the ship on the gameboard
      currentPlayer.gameboard.placeShips(
        shipList[currentShipIndex],
        currentHeadCell.x,
        currentHeadCell.y,
        currentOrientation,
      );
      // draw the placed ship
      const coords =
        currentPlayer.gameboard[
          `ship${["One", "Two", "Three", "Four", "Five"][currentShipIndex]}Coordinates`
        ];
      drawShips(coords, boardDiv);

      // move to the next ship or next player
      currentShipIndex++;
      if (currentShipIndex < shipList.length) {
        // more ships to place for this player
        currentHeadCell = null;
        updatePlacementText();
        clearShipVisuals(boardSelector);
      } else if (currentPlayerString === "Player 1") {
        // switch to Player 2
        currentPlayerString = "Player 2";
        currentPlayer = player2;
        boardSelector = ".gameboard-right";
        boardDiv = player2Div;
        currentShipIndex = 0;
        currentHeadCell = null;
        updatePlacementText();
        clearShipVisuals(boardSelector);
      } else {
        // all ships placed, start game
        startGame(player1, player2);
      }
    } catch (err) {
      // if placement is invalid, show error and allow retry
      showError("Invalid placement, try again.", confirmPlacement);
    }
  }
  // attach the preview click handler to the gameboard container
  domContent.addEventListener("click", handlePreviewClick);
  // show the initial placement instructions
  updatePlacementText();
}

function handleAttackClick(player1, player2) {
  return function (event) {
    if (!event.target.classList.contains("grid-cell")) return;
    if (event.target.classList.contains("attacked")) return;
    event.target.classList.add("attacked");

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    let attackResult, gameOver;
    if (event.target.parentElement.classList.contains("gameboard-left")) {
      attackResult = player1.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
      if (attackResult === "sunk") console.log("Ship Sunk!");
      gameOver = player1.gameboard.reportAllSunk();
    } else if (
      event.target.parentElement.classList.contains("gameboard-right")
    ) {
      attackResult = player2.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
      if (attackResult === "sunk") console.log("Ship Sunk!");
      gameOver = player2.gameboard.reportAllSunk();
    }

    if (gameOver) {
      console.log("Game Over");
      domContent.removeEventListener(
        "click",
        handleAttackClick(player1, player2),
      );
    }
  };
}

export function startGame(player1, player2) {
  domContent.addEventListener("click", handleAttackClick(player1, player2));
}
