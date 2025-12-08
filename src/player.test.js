import { Player } from "./player.js";

describe("Player", () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  test("Player has a makePlayer method", () => {
    expect(player.makePlayer("real")).toBe("real player made");
    expect(player.makePlayer("computer")).toBe("computer player made");
  });

  test("Each Player object has its own unique gameboard", () => {
    const player1 = new Player();
    const player2 = new Player();
    player1.makePlayer("real");
    player2.makePlayer("real");
    expect(player1.gameboard).not.toBe(player2.gameboard);
  });
});
