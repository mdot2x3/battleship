import { Gameboard } from "./gameboard.js";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("Gameboard has a placeShips method", () => {
    expect(gameboard.placeShips("carrier")).toBe(1);
  });

  test("placeShips method should accept valid types of ship", () => {
    expect(gameboard.placeShips("Carrier")).toBe(1);
    expect(gameboard.placeShips("Battleship")).toBe(2);
    expect(gameboard.placeShips("Cruiser")).toBe(3);
    expect(gameboard.placeShips("Submarine")).toBe(4);
    expect(gameboard.placeShips("Destroyer")).toBe(5);
    expect(gameboard.placeShips("BATTLESHIP")).toBe(2);
    expect(gameboard.placeShips("submarine")).toBe(4);
    expect(() => gameboard.placeShips("Tugboat")).toThrow();
  });

  //   receiveAttack;

  //   missedAttacks;

  //   reportAllSunk;
});
