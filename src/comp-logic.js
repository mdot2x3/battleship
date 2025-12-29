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

export function handleComputerAttack(gameboard) {
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
}
