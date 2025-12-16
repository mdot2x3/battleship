export function setupEvents(player1, player2) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("New Game code that runs on page load goes here.");
  });

  const domContent = document.querySelector(".dom-content");

  function handleBoardClick(event) {
    if (!event.target.classList.contains("grid-cell")) return;

    if (event.target.classList.contains("attacked")) return;
    event.target.classList.add("attacked");

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    let attackResult, gameOver;
    if (event.target.parentElement.classList.contains("gameboard-left")) {
      attackResult = player1.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
      if (attackResult === "sunk") console.log("Ship Sunk!");
      gameOver = player1.gameboard.reportAllSunk();
    } else if (
      event.target.parentElement.classList.contains("gameboard-right")
    ) {
      attackResult = player2.gameboard.receiveAttack(x, y);
      event.target.style.backgroundColor =
        attackResult === "miss" ? "blue" : "red";
      if (attackResult === "sunk") console.log("Ship Sunk!");
      gameOver = player2.gameboard.reportAllSunk();
    }

    if (gameOver) {
      console.log("Game Over");
      domContent.removeEventListener("click", handleBoardClick);
    }
  }

  domContent.addEventListener("click", handleBoardClick);
}
