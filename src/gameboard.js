export class Gameboard {
  constructor() {
    this.length = 10;
    this.height = 10;
    this.shipOnePlaced = false;
    this.shipTwoPlaced = false;
    this.shipThreePlaced = false;
    this.shipFourPlaced = false;
    this.shipFivePlaced = false;
  }

  placeShips(ship) {
    let shipType;

    let formatShip = ship.toLowerCase();
    switch (formatShip) {
      case "carrier":
        shipType = 1;
        break;
      case "battleship":
        shipType = 2;
        break;
      case "cruiser":
        shipType = 3;
        break;
      case "submarine":
        shipType = 4;
        break;
      case "destroyer":
        shipType = 5;
        break;
      default:
        throw new Error("Invalid ship entry.");
    }

    return shipType;
  }
}
