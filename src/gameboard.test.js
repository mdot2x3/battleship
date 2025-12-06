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
    expect(gameboard.placeShips("Cruiser", 8, 9, "V")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [8, 9],
        [8, 10],
        [8, 11],
      ],
      shipOrientation: "v",
    });
    expect(gameboard.placeShips("Submarine", 0, 1, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      shipOrientation: "h",
    });
    expect(gameboard.placeShips("Destroyer", 10, 10, "h")).toStrictEqual({
      shipLength: 2,
      shipCoordinates: [
        [10, 10],
        [11, 10],
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
    expect(gameboard.placeShips("submarine", 9, 8, "H")).toStrictEqual({
      shipLength: 3,
      shipCoordinates: [
        [9, 8],
        [10, 8],
        [11, 8],
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
    expect(gameboard.receiveAttack(3, 4)).toBe("hit");
  });

  test("receiveAttack method registers hits", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(3, 4)).toBe("hit");
  });

  test("receiveAttack method calls the targeted Ship's hit method", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    // replace the ship object with a mock
    gameboard.shipOneObject = { hit: jest.fn() };
    // attack a coordinate that should hit the carrier
    gameboard.receiveAttack(3, 4);
    // assert that hit() was called
    expect(gameboard.shipOneObject.hit).toHaveBeenCalled();
  });

  test("receiveAttack method registers missed shots", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(10, 10)).toBe("miss");
    expect(gameboard.receiveAttack(1, 4)).toBe("miss");
    expect(gameboard.receiveAttack(7, 4)).toBe("miss");
    expect(gameboard.receiveAttack(0, 0)).toBe("miss");
  });

  test("receiveAttack method records all missed shots", () => {
    gameboard.placeShips("Carrier", 2, 4, "h");
    expect(gameboard.receiveAttack(10, 10)).toBe("miss");
    expect(gameboard.receiveAttack(1, 4)).toBe("miss");
    expect(gameboard.receiveAttack(7, 4)).toBe("miss");
    expect(gameboard.receiveAttack(0, 0)).toBe("miss");
    expect(gameboard.missCoordinates).toStrictEqual([
      [10, 10],
      [1, 4],
      [7, 4],
      [0, 0],
    ]);
  });

  //   missedAttacks;

  //   reportAllSunk;
});
