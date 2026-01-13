const domContent = document.querySelector(".dom-content");
const gameText = document.querySelector(".game-text");

// create a grid in the given container
export function createGrid(rows, columns, container) {
  // clear previous grid, if exists
  container.innerHTML = "";
  container.style.display = "grid";
  // + 1 for labels
  container.style.gridTemplateRows = `repeat(${rows + 1}, 1fr)`;
  container.style.gridTemplateColumns = `repeat(${columns + 1}, 1fr)`;

  // axis labels
  const letters = "ABCDEFGHIJ".split("");

  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= columns; x++) {
      let cell = document.createElement("div");

      // top-left corner: empty
      if (x === 0 && y === 0) {
        cell.classList.add("axis-corner");
      }
      // top row: x-axis labels (1-10)
      else if (y === 0) {
        cell.classList.add("axis-label", "axis-x");
        cell.textContent = x;
      }
      // first column: y-axis labels (A-J)
      else if (x === 0) {
        cell.classList.add("axis-label", "axis-y");
        cell.textContent = letters[y - 1];
      }
      // grid cell
      else {
        cell.classList.add("grid-cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
      }
      container.appendChild(cell);
    }
  }
}

// clear all ship preview visuals
export function clearShipPreviews(boardSelector) {
  const cells = domContent.querySelectorAll(`${boardSelector} .grid-cell`);
  cells.forEach((cell) => {
    cell.classList.remove("ship-preview", "ship-preview-active");
    cell.removeAttribute("draggable");
  });
}

// render a ship preview
export function renderShipPreview(x, y, orientation, shipLen, boardSelector) {
  // prevent rendering if head cell is out of bounds
  // clamp head cell so the entire ship fits within the grid bounds
  if (orientation === "h") {
    x = Math.max(1, Math.min(x, 11 - shipLen));
    y = Math.max(1, Math.min(y, 10));
  } else {
    x = Math.max(1, Math.min(x, 10));
    y = Math.max(1, Math.min(y, 11 - shipLen));
  }

  clearShipPreviews(boardSelector);
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
    if (cell) {
      cell.classList.add("ship-preview", "ship-preview-active");
      // add draggable attribute on any cells with above "ship-preview-active" class
      cell.setAttribute("draggable", "true");
    }
  }
  // return the clamped head cell values for use in drag-and-drop functions
  return { x, y };
}

export function createShipDragPreview(shipLen, orientation, cellSize = 32) {
  const dragPreview = document.createElement("div");
  dragPreview.style.display = "flex";
  dragPreview.style.flexDirection = orientation === "h" ? "row" : "column";
  dragPreview.style.position = "absolute";
  dragPreview.style.top = "-9999px";
  for (let i = 0; i < shipLen; i++) {
    const cell = document.createElement("div");
    // match drag preview to grid cell size
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.style.background = "#ccc";
    cell.style.border = "2px solid #333";
    cell.style.opacity = "0.8";
    cell.style.boxSizing = "border-box";
    dragPreview.appendChild(cell);
  }
  document.body.appendChild(dragPreview);
  return dragPreview;
}

// render placed ships
export function renderPlacedShips(coords, container) {
  coords.forEach(([x, y]) => {
    const cell = container.querySelector(
      `.grid-cell[data-x="${x}"][data-y="${y}"]`,
    );
    if (cell) {
      // remove preview styling
      cell.classList.remove("ship-preview");
      cell.classList.add("ship-placed");
    }
  });
}

// update the game text area
export function updateGameText(html) {
  gameText.innerHTML = html;
}

export function setBoardHighlight(player1Div, player2Div, currentTurn) {
  player1Div.classList.remove("active-board");
  player2Div.classList.remove("active-board");

  // remove label highlights from both labels
  const playerLabels = document.querySelectorAll(".player-label");
  playerLabels.forEach((label) => label.classList.remove("active-label"));

  if (currentTurn === "Player 1") {
    // highlight Player 1's label
    if (playerLabels[0]) playerLabels[0].classList.add("active-label");
    // player 1 attacks player 2's board
    player2Div.classList.add("active-board");
  } else {
    // highlight Player 2's label
    if (playerLabels[1]) playerLabels[1].classList.add("active-label");
    // player 2 attacks player 1's board
    player1Div.classList.add("active-board");
  }
}

// show an error message in the game text area
// confirmPlacement function is passed to showError via the onConfirm parameter
export function showError(message, onConfirm = null, onReset = null) {
  gameText.innerHTML += `<p class="error-message" style="color:red;">${message}</p>`;
  // re-attach confirm button handler if needed
  const confirmBtn = gameText.querySelector(".confirm-button");
  // if the button and the confirmPlacement function exist
  if (confirmBtn && onConfirm) {
    // reassign confirmPlacement to the button's click event
    confirmBtn.onclick = onConfirm;
  }
  // re-attach reset button handler if needed
  const resetBtn = gameText.querySelector(".reset-button");
  if (resetBtn && onReset) {
    resetBtn.onclick = onReset;
  }
}
