import express from 'express';

const app = express();
app.use(express.json());

// Initial 8x8 checkers board setup
// eslint-disable-next-line no-unused-vars
let initialBoard = [
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0]
];

// Function to clone the board (deep copy)
function cloneBoard(board) {
  return board.map(row => row.slice());
}

// Get possible moves for the player (1 for human, -1 for AI)
function getPossibleMoves(board, player) {
  let moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === player) {
        if (player === 1 && r > 0 && c > 0 && board[r - 1][c - 1] === 0) {
          moves.push([[r, c], [r - 1, c - 1]]);
        }
        if (player === -1 && r < 7 && c > 0 && board[r + 1][c - 1] === 0) {
          moves.push([[r, c], [r + 1, c - 1]]);
        }
      }
    }
  }
  return moves;
}

// Apply a move to the board
function makeMove(board, move) {
  let newBoard = cloneBoard(board);
  const [start, end] = move;
  newBoard[end[0]][end[1]] = newBoard[start[0]][start[1]];
  newBoard[start[0]][start[1]] = 0;
  return newBoard;
}

// Minimax Algorithm for AI moves
function minimax(board, depth, isMaximizing) {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  const moves = getPossibleMoves(board, isMaximizing ? -1 : 1);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const evaluateExpression = minimax(newBoard, depth - 1, false);
      maxEval = Math.max(maxEval, evaluateExpression);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const evaluateExpression = minimax(newBoard, depth - 1, true);
      minEval = Math.min(minEval, evaluateExpression);
    }
    return minEval;
  }
}

// Simple evaluation function to score the board
function evaluateBoard(board) {
  let score = 0;
  for (const row of board) {
    for (const piece of row) {
      score += piece;
    }
  }
  return score;
}

// API endpoint to get the AI move
app.post('/get_ai_move', (req, res) => {
  const { board } = req.body;

  // Get all possible moves for AI (player -1)
  const possibleMoves = getPossibleMoves(board, -1);

  let bestMove = null;
  let bestScore = -Infinity;

  // Use Minimax to find the best move
  for (const move of possibleMoves) {
    const newBoard = makeMove(board, move);
    const score = minimax(newBoard, 3, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  res.json({ move: bestMove });
});

// Start the Express server
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));