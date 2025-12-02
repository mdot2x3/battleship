import { Ship } from "./ship.js";

describe("Ship", () => {
  test("Ship has a length property", () => {
    const ship = new Ship(900);
    expect(ship.length).toBe(900);
  });
});
