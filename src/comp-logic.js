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
  currentDirection: null,
  candidateCells: [],
};

export function updateComputerAttackState(result, x, y) {
  if (result === "hit") {
    if (computerAttackState.mode === "random") {
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
    } else if (computerAttackState.mode === "hunt") {
      // second hit: determine direction and enter target mode
      const { originHit } = computerAttackState;
      if (x !== originHit.x) {
        computerAttackState.currentDirection = "h";
      } else if (y !== originHit.y) {
        computerAttackState.currentDirection = "v";
      }
      computerAttackState.mode = "target";
      computerAttackState.lastHit = { x, y };
    } else if (computerAttackState.mode === "target") {
      // if already in target mode, just update lastHit
      computerAttackState.lastHit = { x, y };
    }
  } else if (result === "sunk") {
    // reset to random mode after sinking a ship
    computerAttackState.mode = "random";
    computerAttackState.originHit = null;
    computerAttackState.lastHit = null;
    computerAttackState.currentDirection = null;
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
      computerAttackState.currentDirection = null;
    }
  }
}

// easy difficulty: always random
export function computerAttackEasy(gameboard) {
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
  if (unattacked.length === 0) return null;
  // pick one array x/y pair from a random index
  // uses destructuring to create variables
  const [x, y] = unattacked[Math.floor(Math.random() * unattacked.length)];
  // final guard: ensure cell is not already attacked
  if (gameboard.wasCellAttacked(x, y)) return computerAttackEasy(gameboard);
  return { x, y };
}

// medium difficulty: random, then hunt/target
export function computerAttackMedium(gameboard) {
  // if in random mode, pick random unattacked cell
  if (computerAttackState.mode === "random") {
    return computerAttackEasy(gameboard);
  }
  // if in hunt mode, pick from candidateCells
  if (computerAttackState.mode === "hunt") {
    // pick a random candidate cell from adjacent cells
    const candidates = computerAttackState.candidateCells.filter(
      ([cx, cy]) => !gameboard.wasCellAttacked(cx, cy),
    );
    if (candidates.length === 0) {
      // fallback to random if no candidates left
      computerAttackState.mode = "random";
      return computerAttackEasy(gameboard);
    }
    const [x, y] = candidates[Math.floor(Math.random() * candidates.length)];
    // final guard: ensure cell is not already attacked
    if (gameboard.wasCellAttacked(x, y)) return computerAttackMedium(gameboard);
    return { x, y };
  }
  // if in target mode, continue in direction
  if (computerAttackState.mode === "target") {
    const { originHit, lastHit, currentDirection } = computerAttackState;
    // try to continue in the current direction from the last hit
    let nextCell;
    if (currentDirection === "h") {
      nextCell =
        lastHit.x > originHit.x
          ? // try to extend right
            [lastHit.x + 1, lastHit.y]
          : // try to extend left
            [lastHit.x - 1, lastHit.y];
    } else if (currentDirection === "v") {
      nextCell =
        lastHit.y > originHit.y
          ? // try to extend down
            [lastHit.x, lastHit.y + 1]
          : // try to extend up
            [lastHit.x, lastHit.y - 1];
    }
    // if nextCell is out of bounds or already attacked, fallback
    const [nx, ny] = nextCell;
    if (
      nx < 1 ||
      nx > 10 ||
      ny < 1 ||
      ny > 10 ||
      gameboard.wasCellAttacked(nx, ny)
    ) {
      // fallback for medium mode, reset to random
      computerAttackState.mode = "random";
      return computerAttackEasy(gameboard);
    }
    // final guard: ensure cell is not already attacked
    if (gameboard.wasCellAttacked(nx, ny))
      return computerAttackMedium(gameboard);
    return { x: nx, y: ny };
  }
  // fallback
  return computerAttackEasy(gameboard);
}

// hard difficulty: advanced hunt/target
export function computerAttackHard(gameboard) {
  // if in random mode, pick random unattacked cell
  if (computerAttackState.mode === "random") {
    return computerAttackEasy(gameboard);
  }
  // if in hunt mode, pick from candidateCells
  if (computerAttackState.mode === "hunt") {
    const candidates = computerAttackState.candidateCells.filter(
      ([cx, cy]) => !gameboard.wasCellAttacked(cx, cy),
    );
    if (candidates.length === 0) {
      computerAttackState.mode = "random";
      return computerAttackEasy(gameboard);
    }
    const [x, y] = candidates[Math.floor(Math.random() * candidates.length)];
    // final guard: ensure cell is not already attacked
    if (gameboard.wasCellAttacked(x, y)) return computerAttackHard(gameboard);
    return { x, y };
  }
  // if in target mode, advanced logic
  if (computerAttackState.mode === "target") {
    const { originHit, lastHit, currentDirection } = computerAttackState;
    let nextCell;
    if (currentDirection === "h") {
      nextCell =
        lastHit.x > originHit.x
          ? [lastHit.x + 1, lastHit.y]
          : [lastHit.x - 1, lastHit.y];
    } else if (currentDirection === "v") {
      nextCell =
        lastHit.y > originHit.y
          ? [lastHit.x, lastHit.y + 1]
          : [lastHit.x, lastHit.y - 1];
    }
    const [nx, ny] = nextCell;
    if (
      nx >= 1 &&
      nx <= 10 &&
      ny >= 1 &&
      ny <= 10 &&
      !gameboard.wasCellAttacked(nx, ny)
    ) {
      // final guard: ensure cell is not already attacked
      if (gameboard.wasCellAttacked(nx, ny))
        return computerAttackHard(gameboard);
      return { x: nx, y: ny };
    }
    // try opposite direction from origin
    let oppositeCell;
    if (currentDirection === "h") {
      oppositeCell =
        lastHit.x > originHit.x
          ? [originHit.x - 1, originHit.y]
          : [originHit.x + 1, originHit.y];
    } else if (currentDirection === "v") {
      oppositeCell =
        lastHit.y > originHit.y
          ? [originHit.x, originHit.y - 1]
          : [originHit.x, originHit.y + 1];
    }
    const [ox, oy] = oppositeCell;
    if (
      ox >= 1 &&
      ox <= 10 &&
      oy >= 1 &&
      oy <= 10 &&
      !gameboard.wasCellAttacked(ox, oy)
    ) {
      // final guard: ensure cell is not already attacked
      if (gameboard.wasCellAttacked(ox, oy))
        return computerAttackHard(gameboard);
      computerAttackState.lastHit = { x: ox, y: oy };
      return { x: ox, y: oy };
    }
    // switch orientation and try both directions from origin
    if (currentDirection === "h") {
      computerAttackState.currentDirection = "v";
      let upCell = [originHit.x, originHit.y - 1];
      if (
        upCell[1] >= 1 &&
        upCell[1] <= 10 &&
        !gameboard.wasCellAttacked(upCell[0], upCell[1])
      ) {
        // final guard: ensure cell is not already attacked
        if (gameboard.wasCellAttacked(upCell[0], upCell[1]))
          return computerAttackHard(gameboard);
        computerAttackState.lastHit = { x: upCell[0], y: upCell[1] };
        return { x: upCell[0], y: upCell[1] };
      }
      let downCell = [originHit.x, originHit.y + 1];
      if (
        downCell[1] >= 1 &&
        downCell[1] <= 10 &&
        !gameboard.wasCellAttacked(downCell[0], downCell[1])
      ) {
        // final guard: ensure cell is not already attacked
        if (gameboard.wasCellAttacked(downCell[0], downCell[1]))
          return computerAttackHard(gameboard);
        computerAttackState.lastHit = { x: downCell[0], y: downCell[1] };
        return { x: downCell[0], y: downCell[1] };
      }
    } else if (currentDirection === "v") {
      computerAttackState.currentDirection = "h";
      let leftCell = [originHit.x - 1, originHit.y];
      if (
        leftCell[0] >= 1 &&
        leftCell[0] <= 10 &&
        !gameboard.wasCellAttacked(leftCell[0], leftCell[1])
      ) {
        // final guard: ensure cell is not already attacked
        if (gameboard.wasCellAttacked(leftCell[0], leftCell[1]))
          return computerAttackHard(gameboard);
        computerAttackState.lastHit = { x: leftCell[0], y: leftCell[1] };
        return { x: leftCell[0], y: leftCell[1] };
      }
      let rightCell = [originHit.x + 1, originHit.y];
      if (
        rightCell[0] >= 1 &&
        rightCell[0] <= 10 &&
        !gameboard.wasCellAttacked(rightCell[0], rightCell[1])
      ) {
        // final guard: ensure cell is not already attacked
        if (gameboard.wasCellAttacked(rightCell[0], rightCell[1]))
          return computerAttackHard(gameboard);
        computerAttackState.lastHit = { x: rightCell[0], y: rightCell[1] };
        return { x: rightCell[0], y: rightCell[1] };
      }
    }
    // if all else fails, reset to random
    computerAttackState.mode = "random";
    computerAttackState.originHit = null;
    computerAttackState.lastHit = null;
    computerAttackState.currentDirection = null;
    return computerAttackEasy(gameboard);
  }
  // fallback
  return computerAttackEasy(gameboard);
}
