import { Ship } from "./ship.js";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(4);
  });

  test("Ship has a length property", () => {
    expect(ship.length).toBe(4);
  });

  test("Ship throws an error if length is not a valid number", () => {
    expect(() => new Ship("abc")).toThrow();
    expect(() => new Ship(12)).toThrow();
    expect(() => new Ship()).toThrow();
  });

  test("Ship has a hitCount property that starts at 0", () => {
    expect(ship.hitCount).toBe(0);
  });

  test("Ship has a hit method that increases hitCount", () => {
    expect(ship.hit()).toBe(1);
    expect(ship.hit()).toBe(2);
    expect(ship.hit()).toBe(3);
  });

  test("Ship has a Boolean isSunk() property", () => {
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk method returns true when hitCount equals length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    ship.hitCount = 100;
    expect(ship.isSunk()).toBe(true);
  });
});
