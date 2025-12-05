import { Gameboard } from "./gameboard.js";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("Gameboard has a placeShips method", () => {
    expect(gameboard.placeShips("carrier", 5, 5, "v")).toStrictEqual({
      shipLength: 5,
      shipCoordinates: [5, 5],
      shipOrientation: "v",
    });
  });

  test("placeShips method should accept valid types of ships", () => {
    expect(gameboard.placeShips("Carrier", 2, 4, "h")).toStrictEqual({
      shipLength: 5,
      shipCoordinates: [2, 4],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("Battleship", 1, 3, "v")).toStrictEqual({
      shipLength: 4,
      shipCoordinates: [1, 3],
      shipOrientation: "v",
    });
    expect(gameboard.placeShips("Cruiser", 8, 9, "V")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [8, 9],
      shipOrientation: "v",
    });
    expect(gameboard.placeShips("Submarine", 0, 1, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [0, 1],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("Destroyer", 10, 10, "h")).toStrictEqual({
      shipLength: 2,
      shipCoordinates: [10, 10],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("BATTLESHIP", 7, 5, "h")).toStrictEqual({
      shipLength: 4,
      shipCoordinates: [7, 5],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("submarine", 9, 8, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [9, 8],
      shipOrientation: "h",
    });
    expect(() => gameboard.placeShips("Tugboat")).toThrow();
  });

  test("placeShips method should accept valid coordinate pairs and orientation", () => {
    expect(gameboard.placeShips("destroyer", 1, 2, "H")).toStrictEqual({
      shipLength: 2,
      shipCoordinates: [1, 2],
      shipOrientation: "h",
    });
  });

  //   receiveAttack;

  //   missedAttacks;

  //   reportAllSunk;
});
