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
    this.hitCoordinates = [];
    this.missCoordinates = [];
    this.sunkShipCount = 0;
  }

  // helper function to ensure input coordinates are valid
  inBounds(xCoord, yCoord) {
    if (xCoord < 1 || xCoord > 10)
      throw new Error(
        "X Coordinate must be no less than 1 and no greater than 10.",
      );
    if (yCoord < 1 || yCoord > 10)
      throw new Error(
        "Y Coordinate must be no less than 1 and no greater than 10.",
      );
  }

  // helper function to check for overlapping ships during placement
  checkOverlap(newCoords, shipCoordinates) {
    // gather all existing, placed ship coordinates (exclude current ship)
    const allPlacedCoords = [];
    // spread operator spreads the elements of this.shipOneCoordinates array into the allPlacedCoords array, and if the array is undef/null, it will push elements from an empty array instead, thus nothing is pushed
    if (shipCoordinates !== "shipOneCoordinates")
      allPlacedCoords.push(...(this.shipOneCoordinates || []));
    if (shipCoordinates !== "shipTwoCoordinates")
      allPlacedCoords.push(...(this.shipTwoCoordinates || []));
    if (shipCoordinates !== "shipThreeCoordinates")
      allPlacedCoords.push(...(this.shipThreeCoordinates || []));
    if (shipCoordinates !== "shipFourCoordinates")
      allPlacedCoords.push(...(this.shipFourCoordinates || []));
    if (shipCoordinates !== "shipFiveCoordinates")
      allPlacedCoords.push(...(this.shipFiveCoordinates || []));

    // check for overlap (uses destructuring assignment with n meaning new, e meaning existing)
    for (const [nx, ny] of newCoords) {
      if (allPlacedCoords.some(([ex, ey]) => ex === nx && ey === ny)) {
        return true;
      }
    }
    return false;
  }

  placeShips(ship, xCoord, yCoord, orientation) {
    let newShip;
    let shipCoordinates;
    let shipOrientation;
    let shipLength;
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
        shipLength = 5;
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
        shipLength = 4;
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
        shipLength = 3;
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
        shipLength = 3;
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
        shipLength = 2;
        this.shipFiveObject = newShip;
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

    // gather all ship cell coordinates for the new ship
    const newCoords = [];
    for (let i = 0; i < shipLength; i++) {
      const x = formatOrientation === "h" ? xCoord + i : xCoord;
      const y = formatOrientation === "v" ? yCoord + i : yCoord;

      // check that all segments are in-bounds
      this.inBounds(x, y);
      newCoords.push([x, y]);
    }

    // check for overlap
    if (this.checkOverlap(newCoords, shipCoordinates)) {
      throw new Error("Ships cannot overlap.");
    }

    // if no overlap is found, assign the coordinates to the board
    this[shipCoordinates] = newCoords;

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

    const shipNames = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];

    for (let i = 0; i < shipCoordProps.length; i++) {
      if (shipCoordProps[i].some(([x, y]) => x === xCoord && y === yCoord)) {
        shipObjProps[i].hit();
        if (shipObjProps[i].isSunk()) {
          this.sunkShipCount += 1;
          return { result: "sunk", shipName: shipNames[i] };
        }
        this.hitCoordinates.push([xCoord, yCoord]);
        return { result: "hit" };
      }
    }
    this.missCoordinates.push([xCoord, yCoord]);
    return { result: "miss" };
  }

  reportAllSunk() {
    if (this.sunkShipCount >= 5) {
      return true;
    }
    return false;
  }

  wasCellAttacked(x, y) {
    if (this.missCoordinates.some(([mx, my]) => mx === x && my === y))
      return true;
    if (this.hitCoordinates.some(([hx, hy]) => hx === x && hy === y))
      return true;
    return false;
  }
}
