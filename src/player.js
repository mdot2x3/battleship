import { Gameboard } from "./gameboard.js";

export class Player {
  constructor() {
    this.playerType;
    this.gameboard;
  }

  makePlayer(player) {
    if (player !== "real" && player !== "computer") {
      throw new Error("Invalid player type.");
    }
    if (player === "real") {
      this.playerType = "real";
      this.gameboard = new Gameboard();
      return `${this.playerType} player made`;
    }
    this.playerType = "computer";
    this.gameboard = new Gameboard();
    return `${this.playerType} player made`;
  }
}
