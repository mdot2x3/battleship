import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.length = 10;
    this.height = 10;
    this.shipOne = [0, 0, ""];
    this.shipTwo = [0, 0, ""];
    this.shipThree = [0, 0, ""];
    this.shipFour = [0, 0, ""];
    this.shipFive = [0, 0, ""];
  }

  placeShips(ship, xCoord, yCoord, orientation) {
    let newShip;
    let shipProperty;
    const formatShip = ship.toLowerCase();
    const formatOrientation = orientation.toLowerCase();

    if (formatOrientation !== "h" && formatOrientation !== "v")
      throw new Error("Invalid orientation entry.");

    if (xCoord < 0 || xCoord > 10)
      throw new Error(
        "X Coordinate must be no less than 0 and no greater than 10.",
      );
    if (yCoord < 0 || yCoord > 10)
      throw new Error(
        "Y Coordinate must be no less than 0 and no greater than 10.",
      );

    switch (formatShip) {
      case "carrier":
        newShip = new Ship(5);
        shipProperty = "shipOne";
        this.shipOne = [xCoord, yCoord, formatOrientation];
        break;
      case "battleship":
        newShip = new Ship(4);
        shipProperty = "shipTwo";
        this.shipTwo = [xCoord, yCoord, formatOrientation];
        break;
      case "cruiser":
        newShip = new Ship(3);
        shipProperty = "shipThree";
        this.shipThree = [xCoord, yCoord, formatOrientation];
        break;
      case "submarine":
        newShip = new Ship(3);
        shipProperty = "shipFour";
        this.shipFour = [xCoord, yCoord, formatOrientation];
        break;
      case "destroyer":
        newShip = new Ship(2);
        shipProperty = "shipFive";
        this.shipFive = [xCoord, yCoord, formatOrientation];
        break;
      default:
        throw new Error("Invalid ship entry.");
    }

    return {
      shipLength: newShip.length,
      shipCoordinates: [this[shipProperty][0], this[shipProperty][1]],
      shipOrientation: this[shipProperty][2],
    };
  }
}
