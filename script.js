const boardEl = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function initBoard() {
  boardEl.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", onCellClick);
    boardEl.appendChild(cell);
  });
}

function onCellClick(e) {
  const i = e.target.dataset.index;

  if (board[i] !== "" || gameOver) return;

  board[i] = currentPlayer;
  render();

  if (checkWin(currentPlayer)) {
    alert(`${currentPlayer} gewinnt!`);
    gameOver = true;
    return;
  }

  if (board.every(c => c !== "")) {
    alert("Unentschieden!");
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "Y" : "X";

  if (modeSelect.value === "cpu" && currentPlayer === "Y") {
    setTimeout(cpuMove, 300);
  }
}

function cpuMove() {
  let move;

  switch (difficultySelect.value) {
    case "easy":
      move = randomMove();
      break;
    case "medium":
      move = mediumMove();
      break;
    case "hard":
      move = minimax(board, "Y").index;
      break;
  }

  board[move] = "Y";
  render();

  if (checkWin("Y")) {
    alert("Computer gewinnt!");
    gameOver = true;
    return;
  }

  if (board.every(c => c !== "")) {
    alert("Unentschieden!");
    gameOver = true;
    return;
  }

  currentPlayer = "X";
}

function randomMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function mediumMove() {
  // 1. Kann CPU gewinnen?
  for (let i=0;i<9;i++) {
    if (board[i]==="") {
      board[i]="Y";
      if (checkWin("Y")) { board[i]=""; return i; }
      board[i]="";
    }
  }
  // 2. Spieler blocken
  for (let i=0;i<9;i++) {
    if (board[i]==="") {
      board[i]="X";
      if (checkWin("X")) { board[i]=""; return i; }
      board[i]="";
    }
  }
  // 3. Zufall
  return randomMove();
}

function minimax(newBoard, player) {
  const empty = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

  if (checkWin("X", newBoard)) return { score: -10 };
  if (checkWin("Y", newBoard)) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  const moves = [];

  for (let i of empty) {
    const move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === "Y") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "Y");
      move.score = result.score;
    }

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "Y") {
    bestMove = moves.reduce((a,b)=>a.score>b.score?a:b);
  } else {
    bestMove = moves.reduce((a,b)=>a.score<b.score?a:b);
  }

  return bestMove;
}

function checkWin(player, b = board) {
  return winPatterns.some(p => p.every(i => b[i] === player));
}

function render() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

restartBtn.onclick = () => {
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  gameOver = false;
  initBoard();
};

initBoard();
