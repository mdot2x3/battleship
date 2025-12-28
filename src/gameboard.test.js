import { Gameboard } from "./gameboard.js";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("Gameboard has a placeShips method", () => {
    expect(gameboard.placeShips("carrier", 5, 5, "v")).toStrictEqual({
      shipLength: 5,
      shipCoordinates: [
        [5, 5],
        [5, 6],
        [5, 7],
        [5, 8],
        [5, 9],
      ],
      shipOrientation: "v",
    });
  });

  test("placeShips method should accept valid types of ships", () => {
    expect(gameboard.placeShips("Carrier", 2, 4, "h")).toStrictEqual({
      shipLength: 5,
      shipCoordinates: [
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
      ],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("Battleship", 1, 3, "v")).toStrictEqual({
      shipLength: 4,
      shipCoordinates: [
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
      ],
      shipOrientation: "v",
    });
    expect(gameboard.placeShips("Cruiser", 8, 6, "V")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [8, 6],
        [8, 7],
        [8, 8],
      ],
      shipOrientation: "v",
    });
    expect(gameboard.placeShips("Submarine", 1, 1, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("Destroyer", 9, 10, "h")).toStrictEqual({
      shipLength: 2,
      shipCoordinates: [
        [9, 10],
        [10, 10],
      ],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("BATTLESHIP", 7, 5, "h")).toStrictEqual({
      shipLength: 4,
      shipCoordinates: [
        [7, 5],
        [8, 5],
        [9, 5],
        [10, 5],
      ],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("submarine", 4, 8, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [4, 8],
        [5, 8],
        [6, 8],
      ],
      shipOrientation: "h",
    });
    expect(() => gameboard.placeShips("Tugboat")).toThrow();
  });

  test("placeShips method should accept valid coordinate pairs and orientation", () => {
    expect(gameboard.placeShips("destroyer", 1, 2, "H")).toStrictEqual({
      shipLength: 2,
      shipCoordinates: [
        [1, 2],
        [2, 2],
      ],
      shipOrientation: "h",
    });
    expect(() => gameboard.placeShips("destroyer", -1, 2, "h")).toThrow();
    expect(() => gameboard.placeShips("destroyer", 1, 16, "V")).toThrow();
    expect(() => gameboard.placeShips("destroyer", 4, 5, "z")).toThrow();
  });

  test("Gameboard has a receiveAttack method", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(3, 4)).toStrictEqual({ result: "hit" });
  });

  test("receiveAttack method registers hits", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(3, 4)).toStrictEqual({ result: "hit" });
  });

  test("receiveAttack method calls the targeted Ship's hit method", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    // replace the ship object with a mock ship (isSunk added later to avoid test TypeError)
    gameboard.shipOneObject = { hit: jest.fn(), isSunk: jest.fn(() => false) };
    // attack a coordinate that should hit the carrier
    gameboard.receiveAttack(3, 4);
    // assert that hit() was called
    expect(gameboard.shipOneObject.hit).toHaveBeenCalled();
  });

  test("receiveAttack method registers missed shots", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(10, 10)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(1, 4)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(7, 4)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(1, 1)).toStrictEqual({ result: "miss" });
  });

  test("receiveAttack method records all missed shots", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(10, 10)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(1, 4)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(7, 4)).toStrictEqual({ result: "miss" });
    expect(gameboard.receiveAttack(1, 1)).toStrictEqual({ result: "miss" });
    expect(gameboard.missCoordinates).toStrictEqual([
      [10, 10],
      [1, 4],
      [7, 4],
      [1, 1],
    ]);
  });

  test("receiveAttack method reports a sunk ship", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(2, 4)).toStrictEqual({ result: "hit" });
    expect(gameboard.receiveAttack(3, 4)).toStrictEqual({ result: "hit" });
    expect(gameboard.receiveAttack(4, 4)).toStrictEqual({ result: "hit" });
    expect(gameboard.receiveAttack(5, 4)).toStrictEqual({ result: "hit" });
    expect(gameboard.receiveAttack(6, 4)).toStrictEqual({
      result: "sunk",
      shipName: "Carrier",
    });
    gameboard.placeShips("Destroyer", 5, 5, "v");
    expect(gameboard.receiveAttack(5, 5)).toStrictEqual({ result: "hit" });
    expect(gameboard.receiveAttack(5, 6)).toStrictEqual({
      result: "sunk",
      shipName: "Destroyer",
    });
  });

  test("reportAllSunk method reports false if not all ships are sunk", () => {
    expect(gameboard.reportAllSunk()).toBe(false);
    gameboard.placeShips("Destroyer", 5, 5, "v");
    gameboard.receiveAttack(5, 5);
    gameboard.receiveAttack(5, 6);
    expect(gameboard.reportAllSunk()).toBe(false);
    expect(gameboard.sunkShipCount).toBe(1);
    gameboard.placeShips("Destroyer", 7, 7, "v");
    gameboard.receiveAttack(7, 7);
    gameboard.receiveAttack(7, 8);
    expect(gameboard.reportAllSunk()).toBe(false);
    expect(gameboard.sunkShipCount).toBe(2);
    gameboard.placeShips("Destroyer", 3, 3, "v");
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(3, 4);
    expect(gameboard.reportAllSunk()).toBe(false);
    expect(gameboard.sunkShipCount).toBe(3);
    gameboard.placeShips("Destroyer", 9, 9, "v");
    gameboard.receiveAttack(9, 9);
    gameboard.receiveAttack(9, 10);
    expect(gameboard.reportAllSunk()).toBe(false);
    expect(gameboard.sunkShipCount).toBe(4);
  });

  test("reportAllSunk method reports true if all ships are sunk", () => {
    gameboard.placeShips("Destroyer", 5, 5, "v");
    gameboard.receiveAttack(5, 5);
    gameboard.receiveAttack(5, 6);
    gameboard.placeShips("Destroyer", 7, 7, "v");
    gameboard.receiveAttack(7, 7);
    gameboard.receiveAttack(7, 8);
    gameboard.placeShips("Destroyer", 3, 3, "v");
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(3, 4);
    gameboard.placeShips("Destroyer", 9, 9, "v");
    gameboard.receiveAttack(9, 9);
    gameboard.receiveAttack(9, 10);
    gameboard.placeShips("Destroyer", 1, 1, "v");
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(1, 2);
    expect(gameboard.reportAllSunk()).toBe(true);
    expect(gameboard.sunkShipCount).toBe(5);
  });
});
