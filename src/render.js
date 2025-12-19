// DOM references
const domContent = document.querySelector(".dom-content");
const gameText = document.querySelector(".game-text");

// create a grid in the given container
export function createGrid(rows, columns, container) {
  // clear previous grid, if exists
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

// draw a ship preview
export function drawShipPreview(x, y, orientation, shipLen, boardSelector) {
  clearShipVisuals(boardSelector);
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

// clear all ship preview visuals
export function clearShipVisuals(boardSelector) {
  const cells = domContent.querySelectorAll(`${boardSelector} .grid-cell`);
  cells.forEach((cell) => cell.classList.remove("ship-preview"));
}

// draw placed ships
export function drawShips(coords, container) {
  coords.forEach(([x, y]) => {
    const cell = container.querySelector(
      `.grid-cell[data-x="${x}"][data-y="${y}"]`,
    );
    if (cell) cell.style.backgroundColor = "black";
  });
}

// update the game text area
export function updateGameText(html) {
  gameText.innerHTML = html;
}

// show an error message in the game text area
export function showError(message) {
  gameText.innerHTML += `<p style="color:red;">${message}</p>`;
}
