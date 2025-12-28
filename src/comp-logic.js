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
