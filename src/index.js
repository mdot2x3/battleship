// import css file for css-loader & style-loader (do not delete)
import "./style.css";
import { Player } from "./player.js";
import { newGame } from "./events.js";
import { createGrid } from "./render.js";

const player1 = new Player();
const player2 = new Player();
player1.makePlayer("real");
player2.makePlayer("real");

const player1Div = document.querySelector(".gameboard-left");
const player2Div = document.querySelector(".gameboard-right");
createGrid(player1.gameboard.length, player1.gameboard.height, player1Div);
createGrid(player2.gameboard.length, player2.gameboard.height, player2Div);

newGame(player1, player2);
