export function placeComputerShips(gameboard) {
  const shipList = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ];
  for (const ship of shipList) {
    let placed = false;
    while (!placed) {
      const xCoord = Math.floor(Math.random() * 10 + 1);
      const yCoord = Math.floor(Math.random() * 10 + 1);
      const orientation = Math.random() > 0.5 ? "h" : "v";
      try {
        gameboard.placeShips(ship, xCoord, yCoord, orientation);
        placed = true;
      } catch (err) {
        // while loop will run again, this catch is not used
      }
    }
  }
}

// save the attack state to determine the next attack type
export let computerAttackState = {
  mode: "random",
  originHit: null,
  lastHit: null,
  directionsTried: [],
  currentDirection: null,
  candidateCells: [],
};

export function handleComputerAttack(gameboard) {
  if (computerAttackState.mode === "random") {
    // find all unattacked cells
    const unattacked = [];
    for (let x = 1; x <= 10; x++) {
      for (let y = 1; y <= 10; y++) {
        // if wasCellAttacked is not false (aka it is true)
        if (!gameboard.wasCellAttacked(x, y)) {
          unattacked.push([x, y]);
        }
      }
    }
    // pick one array x/y pair from a random index
    // uses destructuring to create variables
    const [x, y] = unattacked[Math.floor(Math.random() * unattacked.length)];
    return { x, y };
  } else if (computerAttackState.mode === "hunt") {
    // pick a random candidate cell from adjacent cells
    const candidates = computerAttackState.candidateCells.filter(
      ([cx, cy]) => !gameboard.wasCellAttacked(cx, cy),
    );
    if (candidates.length === 0) {
      // fallback to random if no candidates left
      computerAttackState.mode = "random";
      return handleComputerAttack(gameboard);
    }
    const [x, y] = candidates[Math.floor(Math.random() * candidates.length)];
    return { x, y };
  } else if (computerAttackState.mode === "target") {
    // try to continue in the current direction from the last hit
    const { originHit, lastHit, currentDirection } = computerAttackState;
    let nextCell;
    if (currentDirection === "h") {
      // try to extend right
      if (lastHit.x > originHit.x) {
        nextCell = [lastHit.x + 1, lastHit.y];
      } else {
        // try to extend left
        nextCell = [lastHit.x - 1, lastHit.y];
      }
    } else if (currentDirection === "vertical") {
      // Try to extend down
      if (lastHit.y > originHit.y) {
        nextCell = [lastHit.x, lastHit.y + 1];
      } else {
        // Try to extend up
        nextCell = [lastHit.x, lastHit.y - 1];
      }
    }
    // if nextCell is out of bounds or already attacked, try the opposite direction or fallback
    const [nx, ny] = nextCell;
    if (
      nx < 1 ||
      nx > 10 ||
      ny < 1 ||
      ny > 10 ||
      gameboard.wasCellAttacked(nx, ny)
    ) {
      // ---add logic here to try the opposite direction or switch orientation
      computerAttackState.mode = "random";
      return handleComputerAttack(gameboard);
    }
    return { x: nx, y: ny };
  }
}

export function updateComputerAttackState(result, x, y) {
  if (result === "hit") {
    computerAttackState.mode = "hunt";
    computerAttackState.originHit = { x, y };
    computerAttackState.lastHit = { x, y };
    // add adjacent cells as candidates
    computerAttackState.candidateCells = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].filter(([cx, cy]) => cx >= 1 && cx <= 10 && cy >= 1 && cy <= 10);
  } else if (result === "sunk") {
    // reset to random mode after sinking a ship
    computerAttackState.mode = "random";
    computerAttackState.originHit = null;
    computerAttackState.lastHit = null;
    computerAttackState.candidateCells = [];
  } else if (result === "miss" && computerAttackState.mode === "hunt") {
    // remove the missed cell from candidates
    computerAttackState.candidateCells =
      computerAttackState.candidateCells.filter(
        ([cx, cy]) => !(cx === x && cy === y),
      );
    // if no candidates left, reset to random
    if (computerAttackState.candidateCells.length === 0) {
      computerAttackState.mode = "random";
      computerAttackState.originHit = null;
      computerAttackState.lastHit = null;
    }
  }
}
