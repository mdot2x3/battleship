export function setupEvents(player1, player2) {
  document.addEventListener("DOMContentLoaded", () => {
    newGame();
  });

  const domContent = document.querySelector(".dom-content");
  const gameText = document.querySelector(".game-text");

  function newGame() {
    gameText.innerHTML = `
    <p>Click to Start: </p>
    <button class="new-button">New Game</button>
    `;
    const newButton = gameText.querySelector(".new-button");
    newButton.addEventListener("click", setupGame);
  }

  function setupGame() {
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

    function updateGameText() {
      gameText.innerHTML = `
            <p>${currentPlayerString}, place your ${shipList[currentShipIndex]} on the board.</p>
            <p>Click again to rotate. Click elsewhere to move. Confirm placement when ready.</p>
            <button class="confirm-button">Confirm</button>
            `;
      gameText.querySelector(".confirm-button").onclick = confirmPlacement;
    }

    function clearShipVisuals() {
      const cells = domContent.querySelectorAll(`${boardSelector} .grid-cell`);
      cells.forEach((cell) => cell.classList.remove("ship-preview"));
    }

    function drawShipPreview(x, y, orientation) {
      clearShipVisuals();
      // compacted way to setup an array and immediately access an index
      const shipLen = [5, 4, 3, 3, 2][currentShipIndex];
      for (let i = 0; i < shipLen; i++) {
        let cell;
        if (orientation === "h") {
          cell = domContent.querySelector(
            `${boardSelector} .grid-cell[data-x="${x + i}"][data-y="${y}"]`,
          );
        } else {
          cell = domContent.querySelector(
            `${boardSelector} .grid-cell[data-x="${x}"][data-y="${y + i}"]`,
          );
        }
        if (cell) cell.classList.add("ship-preview");
      }
    }

    function handlePreviewClick(event) {
      if (!event.target.classList.contains("grid-cell")) return;
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);

      if (
        currentHeadCell &&
        currentHeadCell.x === x &&
        currentHeadCell.y === y
      ) {
        currentOrientation = currentOrientation === "h" ? "v" : "h";
      } else {
        currentHeadCell = { x, y };
        currentOrientation = "h";
      }
      drawShipPreview(x, y, currentOrientation);
    }

    function confirmPlacement() {
      try {
        currentPlayer.gameboard.placeShips(
          shipList[currentShipIndex],
          currentHeadCell.x,
          currentHeadCell.y,
          currentOrientation,
        );
        currentShipIndex++;

        if (currentShipIndex < shipList.length) {
          currentHeadCell = null;
          updateGameText();
          clearShipVisuals();
        } else if (currentPlayerString === "Player1") {
          currentPlayerString = "Player 2";
          currentPlayer = player2;
          boardSelector = ".gameboard-right";
          currentShipIndex = 0;
          currentHeadCell = null;
          updateGameText();
          clearShipVisuals();
        } else {
          startGame();
        }
      } catch (err) {
        gameText.innerHTML = `<p style="color:red;">${err.message}</p>`;
      }
    }

    domContent.addEventListener("click", handlePreviewClick);
    updateGameText();
  }

  function startGame() {
    domContent.addEventListener("click", handleAttackClick);
  }

  function handleAttackClick(event) {
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
      domContent.removeEventListener("click", handleAttackClick);
    }
  }
}
