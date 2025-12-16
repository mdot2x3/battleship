export function setupEvents(player1, player2) {
  document.addEventListener("DOMContentLoaded", (event) => {
    console.log("New Game code that runs on page load goes here.");
  });

  // detect user clicks on gameboard, run receiveAttack() and mark board
  const domContent = document.querySelector(".dom-content");
  domContent.addEventListener("click", (event) => {
    if (!event.target.classList.contains("grid-cell")) return;

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    if (event.target.parentElement.classList.contains("gameboard-left")) {
      const attackResult = player1.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
    } else if (
      event.target.parentElement.classList.contains("gameboard-right")
    ) {
      const attackResult = player2.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
    }
  });
}
