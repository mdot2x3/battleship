import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.length = 10;
    this.height = 10;
    this.shipOneOrientation = "";
    this.shipTwoOrientation = "";
    this.shipThreeOrientation = "";
    this.shipFourOrientation = "";
    this.shipFiveOrientation = "";
    this.shipOne = [[0, 0]];
    this.shipTwo = [[0, 0]];
    this.shipThree = [[0, 0]];
    this.shipFour = [[0, 0]];
    this.shipFive = [[0, 0]];
  }

  // helper function to ensure input coordinates are valid
  inBounds(xCoord, yCoord) {
    if (xCoord < 0 || xCoord > 10)
      throw new Error(
        "X Coordinate must be no less than 0 and no greater than 10.",
      );
    if (yCoord < 0 || yCoord > 10)
      throw new Error(
        "Y Coordinate must be no less than 0 and no greater than 10.",
      );
  }

  placeShips(ship, xCoord, yCoord, orientation) {
    let newShip;
    let shipProperty;
    const formatShip = ship.toLowerCase();
    const formatOrientation = orientation.toLowerCase();

    if (formatOrientation !== "h" && formatOrientation !== "v")
      throw new Error("Invalid orientation entry.");

    this.inBounds(xCoord, yCoord);

    switch (formatShip) {
      case "carrier":
        newShip = new Ship(5);
        shipProperty = "shipOne";
        shipOrientation = "shipOneOrientation";
        this.shipOne = [[xCoord, yCoord]];
        this.shipOneOrientation = formatOrientation;
        if (this.shipOneOrientation === "h") {
          for (let i = 1; i < 5; i++) {
            this.shipOne.push([xCoord + i, yCoord]);
          }
        } else if (this.shipOneOrientation === "v") {
          for (let i = 1; i < 5; i++) {
            this.shipOne.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "battleship":
        newShip = new Ship(4);
        shipProperty = "shipTwo";
        shipOrientation = "shipTwoOrientation";
        this.shipTwo = [[xCoord, yCoord]];
        this.shipTwoOrientation = formatOrientation;
        if (this.shipTwoOrientation === "h") {
          for (let i = 1; i < 4; i++) {
            this.shipTwo.push([xCoord + i, yCoord]);
          }
        } else if (this.shipTwoOrientation === "v") {
          for (let i = 1; i < 4; i++) {
            this.shipTwo.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "cruiser":
        newShip = new Ship(3);
        shipProperty = "shipThree";
        shipOrientation = "shipThreeOrientation";
        this.shipThree = [[xCoord, yCoord]];
        this.shipThreeOrientation = formatOrientation;
        if (this.shipThreeOrientation === "h") {
          for (let i = 1; i < 3; i++) {
            this.shipThree.push([xCoord + i, yCoord]);
          }
        } else if (this.shipThreeOrientation === "v") {
          for (let i = 1; i < 3; i++) {
            this.shipThree.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "submarine":
        newShip = new Ship(3);
        shipProperty = "shipFour";
        shipOrientation = "shipFourOrientation";
        this.shipFour = [[xCoord, yCoord]];
        this.shipFourOrientation = formatOrientation;
        if (this.shipFourOrientation === "h") {
          for (let i = 1; i < 3; i++) {
            this.shipFour.push([xCoord + i, yCoord]);
          }
        } else if (this.shipFourOrientation === "v") {
          for (let i = 1; i < 3; i++) {
            this.shipFour.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "destroyer":
        newShip = new Ship(2);
        shipProperty = "shipFive";
        shipOrientation = "shipFiveOrientation";
        this.shipFive = [[xCoord, yCoord]];
        this.shipFiveOrientation = formatOrientation;
        if (this.shipFiveOrientation === "h") {
          this.shipFive.push([xCoord + 1, yCoord]);
        } else if (this.shipFiveOrientation === "v") {
          this.shipFive.push([xCoord, yCoord + 1]);
        }
        break;
      default:
        throw new Error("Invalid ship entry.");
    }

    return {
      shipLength: newShip.length,
      shipCoordinates: this[shipProperty],
      shipOrientation: this[shipOrientation],
    };
  }

  receiveAttack(xCoord, yCoord) {
    this.inBounds(xCoord, yCoord);
    return "hit";
  }
}
