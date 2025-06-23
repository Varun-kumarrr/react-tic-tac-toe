import ReSetButton from "../ReSetButton/ReSetButton";
import Square from "../Square/Square";
import { useEffect, useState } from "react";

const clickSound = new Audio("/sounds/click.mp3");
const winSound = new Audio("/sounds/win.mp3");
const drawSound = new Audio("/sounds/draw.mp3");

function Board() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [draws, setDraws] = useState(0);
  const [difficulty, setDifficulty] = useState("Hard"); // Easy, Medium, Hard

  function resetGame() {
    setBoard(Array(9).fill(""));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
  }

  function handleClick(index) {
    if (!isPlayerTurn || board[index] !== "" || gameOver) return;
    const newBoard = [...board];
    clickSound.play();
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
    checkWinner(newBoard);
  }

  function checkWinner(newBoard) {
    const winCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let [a, b, c] of winCombinations) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinner(newBoard[a]);
        setGameOver(true);
        winSound.play();
        if (newBoard[a] === "X") setPlayerScore((p) => p + 1);
        else setComputerScore((c) => c + 1);
        return;
      }
    }

    if (!newBoard.includes("")) {
      setWinner("Draw");
      setGameOver(true);
      drawSound.play();
      setDraws((d) => d + 1);
    }
  }

  function getWinner(newBoard) {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of combos) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  }

  function minimax(newBoard, isMaximizing) {
    const result = getWinner(newBoard);
    if (result === "O") return { score: 1 };
    if (result === "X") return { score: -1 };
    if (!newBoard.includes("")) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let move;
      newBoard.forEach((val, idx) => {
        if (val === "") {
          newBoard[idx] = "O";
          const score = minimax(newBoard, false).score;
          newBoard[idx] = "";
          if (score > bestScore) {
            bestScore = score;
            move = idx;
          }
        }
      });
      return { score: bestScore, move };
    } else {
      let bestScore = Infinity;
      let move;
      newBoard.forEach((val, idx) => {
        if (val === "") {
          newBoard[idx] = "X";
          const score = minimax(newBoard, true).score;
          newBoard[idx] = "";
          if (score < bestScore) {
            bestScore = score;
            move = idx;
          }
        }
      });
      return { score: bestScore, move };
    }
  }

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        let move;

        if (difficulty === "Easy") {
          const empty = newBoard.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
          move = empty[Math.floor(Math.random() * empty.length)];
        } else if (difficulty === "Medium") {
          // Try to win
          for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
              const test = [...newBoard];
              test[i] = "O";
              if (getWinner(test) === "O") {
                move = i;
                break;
              }
            }
          }

          // Try to block player
          if (move === undefined) {
            for (let i = 0; i < 9; i++) {
              if (newBoard[i] === "") {
                const test = [...newBoard];
                test[i] = "X";
                if (getWinner(test) === "X") {
                  move = i;
                  break;
                }
              }
            }
          }

          // Random move
          if (move === undefined) {
            const empty = newBoard.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
            move = empty[Math.floor(Math.random() * empty.length)];
          }
        } else if (difficulty === "Hard") {
          move = minimax(newBoard, true).move;
        }

        if (move !== undefined) {
          newBoard[move] = "O";
          setBoard(newBoard);
          checkWinner(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, gameOver, difficulty]);

  return (
    <div className="bg-white py-10 px-8 rounded-2xl text-center shadow-xl relative">
      <h1 className="text-4xl mb-4 text-gray-800">Tic Tac Toe</h1>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="mb-4 px-3 py-1 border rounded"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <div className="text-sm text-gray-600 mb-4">
        <p>Player: {playerScore} | Computer: {computerScore} | Draws: {draws}</p>
      </div>

      <h2 className="text-base text-gray-500 mb-6">
        {gameOver
          ? winner === "Draw"
            ? "It's a Draw!"
            : `${winner} Wins!`
          : isPlayerTurn
          ? "Your Turn"
          : "Computer's Turn"}
      </h2>

      <div className="grid grid-cols-3 gap-2 mb-7 justify-items-center">
        {board.map((value, index) => (
          <Square key={index} value={value} onClick={() => handleClick(index)} />
        ))}
      </div>

      <ReSetButton onClick={resetGame} />

      {gameOver && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white text-center p-8 rounded-xl shadow-2xl w-80 scale-100 opacity-100 transform transition-all duration-300 ease-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
            </h2>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;
