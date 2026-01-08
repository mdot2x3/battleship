import { Player } from "./player.js";
import { createGrid } from "./render.js";
import {
  renderShipPreview,
  clearShipPreviews,
  renderPlacedShips,
  updateGameText,
  setBoardHighlight,
  showError,
} from "./render.js";
import {
  computerAttackEasy,
  computerAttackMedium,
  computerAttackHard,
  updateComputerAttackState,
  placeComputerShips,
} from "./comp-logic.js";

const domContent = document.querySelector(".dom-content");
const player1Div = document.querySelector(".gameboard-left");
const player2Div = document.querySelector(".gameboard-right");

export function newGame() {
  // create default grids (10x10) on launch
  const player1Div = document.querySelector(".gameboard-left");
  const player2Div = document.querySelector(".gameboard-right");
  createGrid(10, 10, player1Div);
  createGrid(10, 10, player2Div);
  updateGameText(`
    <p>Choose a game mode:</p>
    <button class="mode-button" data-mode="pvp">Player vs Player</button>
    <button class="mode-button" data-mode="pvc">Player vs Computer</button>
  `);
  document.querySelectorAll(".mode-button").forEach((btn) => {
    btn.onclick = (e) => {
      const mode = e.target.dataset.mode;
      // create players after mode is chosen
      const player1 = new Player();
      player1.makePlayer("real");
      const player2 = new Player();
      player2.makePlayer(mode === "pvc" ? "computer" : "real");
      if (mode === "pvp") {
        setupGame(player1, player2, "pvp");
      } else if (mode === "pvc") {
        // show difficulty selection
        updateGameText(`
          <p>Select Computer Difficulty:</p>
          <button class="difficulty-button" data-difficulty="easy">Easy</button>
          <button class="difficulty-button" data-difficulty="medium">Medium</button>
          <button class="difficulty-button" data-difficulty="hard">Hard</button>
        `);
        document.querySelectorAll(".difficulty-button").forEach((dbtn) => {
          dbtn.onclick = (ev) => {
            // .difficulty draws from the post-hyphenated string in data-""
            const difficulty = ev.target.dataset.difficulty;
            setupGame(player1, player2, "pvc", difficulty);
          };
        });
      }
    };
  });
}

export function setupGame(
  player1,
  player2,
  mode = "pvp",
  difficulty = "medium",
) {
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

  function handleEnterKey(event) {
    if (event.key === "Enter") confirmPlacement();
  }

  function updatePlacementText() {
    updateGameText(`
      <p>${currentPlayerString}, place your ${shipList[currentShipIndex]} on the board.</p>
      <p>Click again to rotate. Click elsewhere to move. Confirm placement when ready.</p>
      <button class="confirm-button">Confirm</button>
      <button class="reset-button">Reset</button>
    `);
    document.querySelector(".confirm-button").onclick = confirmPlacement;
    document.querySelector(".reset-button").onclick = resetPlacement;
    // add keydown listener for Enter key
    document.addEventListener("keydown", handleEnterKey);
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

    // if clicking any cell of the current ship preview, rotate (pivot from head cell)
    if (event.target.classList.contains("ship-preview-active")) {
      currentOrientation = currentOrientation === "h" ? "v" : "h";
      const shipLen = [5, 4, 3, 3, 2][currentShipIndex];
      // clamp head cell so the entire ship fits within the grid bounds before rendering
      if (currentOrientation === "h") {
        currentHeadCell.x = Math.max(
          1,
          Math.min(currentHeadCell.x, 11 - shipLen),
        );
        currentHeadCell.y = Math.max(1, Math.min(currentHeadCell.y, 10));
      } else {
        currentHeadCell.x = Math.max(1, Math.min(currentHeadCell.x, 10));
        currentHeadCell.y = Math.max(
          1,
          Math.min(currentHeadCell.y, 11 - shipLen),
        );
      }
      renderShipPreview(
        currentHeadCell.x,
        currentHeadCell.y,
        currentOrientation,
        shipLen,
        boardSelector,
      );
      return;
    }
    // otherwise, move the ship preview to the clicked cell (reset orientation to horizontal)
    currentHeadCell = { x, y };
    currentOrientation = "h";
    renderShipPreview(
      x,
      y,
      currentOrientation,
      [5, 4, 3, 3, 2][currentShipIndex],
      boardSelector,
    );
  }

  // add drag event listeners
  // triggered when the user starts dragging a ship preview cell
  boardDiv.addEventListener("dragstart", handleDragStart);
  // triggered when a dragged item is moved over a grid cell
  boardDiv.addEventListener("dragover", handleDragOver);
  // triggered when the user drops the ship preview onto a grid cell
  boardDiv.addEventListener("drop", handleDrop);

  function handleDragStart(event) {
    // checks if the dragged cell is part of the current ship preview
    if (!event.target.classList.contains("ship-preview-active")) return;
    // store offset between head cell and dragged cell
    const dragX = Number(event.target.dataset.x);
    const dragY = Number(event.target.dataset.y);
    // store offset in the drag event’s data, used later on drop
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        offsetX: dragX - currentHeadCell.x,
        offsetY: dragY - currentHeadCell.y,
      }),
    );
  }

  function handleDragOver(event) {
    // allows dropping, not allowed by default
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    // only allow drop on valid grid cells (not axis labels)
    if (!event.target.classList.contains("grid-cell")) return;

    // retrieves the drop cell’s coordinates and the stored offset from data
    const dropX = Number(event.target.dataset.x);
    const dropY = Number(event.target.dataset.y);
    const { offsetX, offsetY } = JSON.parse(
      event.dataTransfer.getData("text/plain"),
    );
    // calculate new head cell position
    // clamp the head cell to within the grid bounds in drag/drop and rotation handlers
    let newHeadX = dropX - offsetX;
    let newHeadY = dropY - offsetY;
    const shipLen = [5, 4, 3, 3, 2][currentShipIndex];

    if (currentOrientation === "h") {
      newHeadX = Math.max(1, Math.min(newHeadX, 11 - shipLen));
      newHeadY = Math.max(1, Math.min(newHeadY, 10));
    } else {
      newHeadX = Math.max(1, Math.min(newHeadX, 10));
      newHeadY = Math.max(1, Math.min(newHeadY, 11 - shipLen));
    }
    // update currentHeadCell and re-render ship preview
    currentHeadCell = { x: newHeadX, y: newHeadY };
    renderShipPreview(
      newHeadX,
      newHeadY,
      currentOrientation,
      shipLen,
      boardSelector,
    );
  }

  function confirmPlacement() {
    // clear previous error message, if exists
    clearError();
    // prevent user confirming without selecting a cell
    if (!currentHeadCell) {
      showError(
        "Please select a cell to place your ship.",
        confirmPlacement,
        resetPlacement,
      );
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
      // render the placed ship
      const coords =
        currentPlayer.gameboard[
          `ship${["One", "Two", "Three", "Four", "Five"][currentShipIndex]}Coordinates`
        ];
      renderPlacedShips(coords, boardDiv);

      // move to the next ship or next player
      currentShipIndex++;
      if (currentShipIndex < shipList.length) {
        // more ships to place for this player
        currentHeadCell = null;
        updatePlacementText();
        clearShipPreviews(boardSelector);
        return;
      }
      // player 1 is now finished, confirm player 1 then run mode check
      if (currentPlayerString === "Player 1") {
        if (mode === "pvp") {
          // hide player 1's ships if pvp mode
          player1Div.querySelectorAll(".ship-placed").forEach((cell) => {
            cell.classList.remove("ship-placed");
          });
          // switch to Player 2 for manual placement
          currentPlayerString = "Player 2";
          currentPlayer = player2;
          boardSelector = ".gameboard-right";
          boardDiv = player2Div;
          currentShipIndex = 0;
          currentHeadCell = null;
          updatePlacementText();
          clearShipPreviews(boardSelector);
          return;
        }
        if (mode === "pvc") {
          // computer places ships
          placeComputerShips(player2.gameboard);
          // hide computer's ships
          player2Div.querySelectorAll(".ship-placed").forEach((cell) => {
            cell.classList.remove("ship-placed");
          });
          // all ships placed for pvc, remove keydown listener and start game
          document.removeEventListener("keydown", handleEnterKey);
          startGame(player1, player2, mode, difficulty);
          return;
        }
      }
      // player 2 is not finished, in pvp mode
      if (currentPlayerString === "Player 2" && mode === "pvp") {
        // hide player 2's ships
        player2Div.querySelectorAll(".ship-placed").forEach((cell) => {
          cell.classList.remove("ship-placed");
        });
        // all ships placed for pvp, remove keydown listener and start game
        document.removeEventListener("keydown", handleEnterKey);
        startGame(player1, player2, mode);
        return;
      }
    } catch (err) {
      // if placement is invalid, show error and allow retry
      showError(
        "Invalid placement, try again.",
        confirmPlacement,
        resetPlacement,
      );
    }
  }

  // helper functions to show/hide modal
  function showModal() {
    document.querySelector("#reset-modal").style.display = "flex";
  }

  function hideModal() {
    document.querySelector("#reset-modal").style.display = "none";
  }

  // reset the current player's board and placement state
  function resetPlacement() {
    clearError();
    showModal();
    const confirmBtn = document.querySelector("#modal-confirm");
    const cancelBtn = document.querySelector("#modal-cancel");

    // remove any previous listeners to avoid stacking
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;

    confirmBtn.onclick = () => {
      hideModal();
      // clear the current player's board data
      if (currentPlayerString === "Player 1") {
        player1.gameboard = new player1.gameboard.constructor();
        // clear the DOM board
        boardDiv.innerHTML = "";
        // re-create the grid for player 1
        import("./render.js").then(({ createGrid }) => {
          createGrid(10, 10, boardDiv);
        });
      } else {
        player2.gameboard = new player2.gameboard.constructor();
        boardDiv.innerHTML = "";
        import("./render.js").then(({ createGrid }) => {
          createGrid(10, 10, boardDiv);
        });
      }
      // reset placement state
      currentShipIndex = 0;
      currentOrientation = "h";
      currentHeadCell = null;
      clearShipPreviews(boardSelector);
      updatePlacementText();
    };

    cancelBtn.onclick = () => {
      hideModal();
    };
  }

  // attach the preview click handler to the gameboard container
  domContent.addEventListener("click", handlePreviewClick);
  // show the initial placement instructions
  updatePlacementText();
}

export function startGame(player1, player2, mode, difficulty = "medium") {
  let currentTurn = "Player 1";
  let gameOver = false;

  updateGameText(`
      <p>Click on the opponents board to try and hit their ship.</p>
      <p>A red square means you've landed a hit. A blue square means you've missed.</p>
      <p>Click to begin the battle!</p>
      <button class="start-button">Start</button>
    `);
  // must wrap the call in an anonymous function so no event object is passed which was causing '[object PointerEvent]' to appear for ${sunkMessage} below, instead it will be the default empty string
  document.querySelector(".start-button").onclick = () => nextTurn();

  function nextTurn(sunkMessage = "") {
    if (gameOver) return;

    // update UI for current turn
    updateGameText(`
      ${sunkMessage}
      <p>${currentTurn}, it is your turn.</p>
    `);
    setBoardHighlight(player1Div, player2Div, currentTurn);

    // if computer's turn in pvc mode, make computer move after a short delay
    if (mode === "pvc" && currentTurn === "Computer Player") {
      setTimeout(() => {
        let attack;
        if (difficulty === "easy") {
          attack = computerAttackEasy(player1.gameboard);
        } else if (difficulty === "medium") {
          attack = computerAttackMedium(player1.gameboard);
        } else if (difficulty === "hard") {
          attack = computerAttackHard(player1.gameboard);
        }
        // no moves left
        if (!attack) return;
        const { x, y } = attack;
        processAttack(x, y, player1, player1Div, "Player 1");
      }, 700);
    } else {
      domContent.addEventListener("click", handlePlayerAttack);
    }
  }

  function handlePlayerAttack(event) {
    if (!event.target.classList.contains("grid-cell")) return;
    if (event.target.classList.contains("attacked")) return;

    // only allow attacks on the opponent's board
    if (
      (currentTurn === "Player 1" &&
        event.target.parentElement.classList.contains("gameboard-left")) ||
      (currentTurn === "Player 2" &&
        event.target.parentElement.classList.contains("gameboard-right")) ||
      (mode === "pvc" && currentTurn === "Computer Player")
    ) {
      return;
    }

    domContent.removeEventListener("click", handlePlayerAttack);

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    if (mode === "pvc" && currentTurn === "Player 1") {
      processAttack(x, y, player2, player2Div, "Computer Player");
    } else if (mode === "pvp") {
      const defender = currentTurn === "Player 1" ? player2 : player1;
      const defenderDiv = currentTurn === "Player 1" ? player2Div : player1Div;
      const nextPlayer = currentTurn === "Player 1" ? "Player 2" : "Player 1";
      processAttack(x, y, defender, defenderDiv, nextPlayer);
    }
  }

  function processAttack(x, y, defender, defenderDiv, nextPlayer) {
    // call the defender's gameboard to process the attack and get the result
    let attackResult = defender.gameboard.receiveAttack(x, y);

    // find the attacked cell in the DOM and update its appearance
    const cell = defenderDiv.querySelector(
      `.grid-cell[data-x="${x}"][data-y="${y}"]`,
    );
    if (cell) {
      cell.classList.add("attacked");
      cell.style.backgroundColor =
        attackResult.result === "miss" ? "blue" : "red";
    }

    // prepare a message if a ship was sunk during this attack
    let sunkMessage = "";
    if (attackResult.result === "sunk") {
      sunkMessage = `<p>${currentTurn} has sunk the enemy's ${attackResult.shipName}!</p>`;
    }

    // update computer attack state if it's the computer's turn
    if (mode === "pvc" && currentTurn === "Computer Player") {
      updateComputerAttackState(attackResult.result, x, y);
    }

    // check if all defender's ships are sunk (game over)
    if (defender.gameboard.reportAllSunk()) {
      gameOver = true;
      updateGameText(`
        ${sunkMessage}
        <p>Game Over! ${currentTurn} wins!</p>
        <button class="play-again-button">Play Again</button>
      `);
      const playAgainBtn = document.querySelector(".play-again-button");
      playAgainBtn.onclick = () => window.location.reload();
      return;
    }

    // switch to the next player's turn and update the UI, passing any sunk message
    currentTurn = nextPlayer;
    nextTurn(sunkMessage);
  }
}
