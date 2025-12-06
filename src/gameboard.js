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
    this.shipOneCoordinates = [];
    this.shipTwoCoordinates = [];
    this.shipThreeCoordinates = [];
    this.shipFourCoordinates = [];
    this.shipFiveCoordinates = [];
    this.shipOneObject = undefined;
    this.shipTwoObject = undefined;
    this.shipThreeObject = undefined;
    this.shipFourObject = undefined;
    this.shipFiveObject = undefined;
    this.missCoordinates = [];
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
    let shipCoordinates;
    let shipOrientation;
    const formatShip = ship.toLowerCase();
    const formatOrientation = orientation.toLowerCase();

    if (formatOrientation !== "h" && formatOrientation !== "v")
      throw new Error("Invalid orientation entry.");

    this.inBounds(xCoord, yCoord);

    switch (formatShip) {
      case "carrier":
        newShip = new Ship(5);
        shipCoordinates = "shipOneCoordinates";
        shipOrientation = "shipOneOrientation";
        this.shipOneObject = newShip;
        this.shipOneCoordinates = [[xCoord, yCoord]];
        this.shipOneOrientation = formatOrientation;
        if (this.shipOneOrientation === "h") {
          for (let i = 1; i < 5; i++) {
            this.shipOneCoordinates.push([xCoord + i, yCoord]);
          }
        } else if (this.shipOneOrientation === "v") {
          for (let i = 1; i < 5; i++) {
            this.shipOneCoordinates.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "battleship":
        newShip = new Ship(4);
        shipCoordinates = "shipTwoCoordinates";
        shipOrientation = "shipTwoOrientation";
        this.shipTwoObject = newShip;
        this.shipTwoCoordinates = [[xCoord, yCoord]];
        this.shipTwoOrientation = formatOrientation;
        if (this.shipTwoOrientation === "h") {
          for (let i = 1; i < 4; i++) {
            this.shipTwoCoordinates.push([xCoord + i, yCoord]);
          }
        } else if (this.shipTwoOrientation === "v") {
          for (let i = 1; i < 4; i++) {
            this.shipTwoCoordinates.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "cruiser":
        newShip = new Ship(3);
        shipCoordinates = "shipThreeCoordinates";
        shipOrientation = "shipThreeOrientation";
        this.shipThreeObject = newShip;
        this.shipThreeCoordinates = [[xCoord, yCoord]];
        this.shipThreeOrientation = formatOrientation;
        if (this.shipThreeOrientation === "h") {
          for (let i = 1; i < 3; i++) {
            this.shipThreeCoordinates.push([xCoord + i, yCoord]);
          }
        } else if (this.shipThreeOrientation === "v") {
          for (let i = 1; i < 3; i++) {
            this.shipThreeCoordinates.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "submarine":
        newShip = new Ship(3);
        shipCoordinates = "shipFourCoordinates";
        shipOrientation = "shipFourOrientation";
        this.shipFourObject = newShip;
        this.shipFourCoordinates = [[xCoord, yCoord]];
        this.shipFourOrientation = formatOrientation;
        if (this.shipFourOrientation === "h") {
          for (let i = 1; i < 3; i++) {
            this.shipFourCoordinates.push([xCoord + i, yCoord]);
          }
        } else if (this.shipFourOrientation === "v") {
          for (let i = 1; i < 3; i++) {
            this.shipFourCoordinates.push([xCoord, yCoord + i]);
          }
        }
        break;
      case "destroyer":
        newShip = new Ship(2);
        shipCoordinates = "shipFiveCoordinates";
        shipOrientation = "shipFiveOrientation";
        this.shipFourObject = newShip;
        this.shipFiveCoordinates = [[xCoord, yCoord]];
        this.shipFiveOrientation = formatOrientation;
        if (this.shipFiveOrientation === "h") {
          this.shipFiveCoordinates.push([xCoord + 1, yCoord]);
        } else if (this.shipFiveOrientation === "v") {
          this.shipFiveCoordinates.push([xCoord, yCoord + 1]);
        }
        break;
      default:
        throw new Error("Invalid ship entry.");
    }

    return {
      shipLength: newShip.length,
      shipCoordinates: this[shipCoordinates],
      shipOrientation: this[shipOrientation],
    };
  }

  receiveAttack(xCoord, yCoord) {
    this.inBounds(xCoord, yCoord);
    const shipCoordProps = [
      this.shipOneCoordinates,
      this.shipTwoCoordinates,
      this.shipThreeCoordinates,
      this.shipFourCoordinates,
      this.shipFiveCoordinates,
    ];
    const shipObjProps = [
      this.shipOneObject,
      this.shipTwoObject,
      this.shipThreeObject,
      this.shipFourObject,
      this.shipFiveObject,
    ];

    for (let i = 0; i < shipCoordProps.length; i++) {
      if (shipCoordProps[i].some(([x, y]) => x === xCoord && y === yCoord)) {
        shipObjProps[i].hit();
        return "hit";
      }
    }
    this.missCoordinates.push([xCoord, yCoord]);
    return "miss";
  }
}
