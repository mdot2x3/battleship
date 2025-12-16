// import css file for css-loader & style-loader (do not delete)
import "./style.css";
import { Player } from "./player.js";
import { setupRender } from "./render.js";
import { setupEvents } from "./events.js";

const player1 = new Player();
const player2 = new Player();
player1.makePlayer("real");
player2.makePlayer("real");

setupRender(player1, player2);
setupEvents(player1, player2);
