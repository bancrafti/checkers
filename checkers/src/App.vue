<template>
  <div>
    <h1>Checkers Game</h1>
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" @click="makeMove(rowIndex, colIndex)">
          <span v-if="cell === 1" class="player">O</span>
          <span v-if="cell === -1" class="ai">X</span>
        </div>
      </div>
    </div>
    <button @click="getAIMove">AI Move</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      board: [
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
      ],
      selected: null,
    };
  },
  methods: {
    makeMove(rowIndex, colIndex) {
      if (this.selected) {
        const [selectedRow, selectedCol] = this.selected;
        if (this.board[selectedRow][selectedCol] === 1 && this.board[rowIndex][colIndex] === 0) {
          this.board[rowIndex][colIndex] = 1;
          this.board[selectedRow][selectedCol] = 0;
          this.selected = null;
        } else {
          this.selected = null; // Deselect if move is invalid
        }
      } else {
        if (this.board[rowIndex][colIndex] === 1) {
          this.selected = [rowIndex, colIndex];
        }
      }
    },
    async getAIMove() {
      try {
        const response = await axios.post('http://127.0.0.1:5000/get_ai_move', {
          board: this.board
        });
        const move = response.data.move;
        this.board = this.makeAIMove(move);
      } catch (error) {
        console.error('Error getting AI move:', error);
      }
    },
    makeAIMove(move) {
      const [start, end] = move;
      const newBoard = this.board.map(row => [...row]); // Deep copy of the board
      newBoard[end[0]][end[1]] = newBoard[start[0]][start[1]];
      newBoard[start[0]][start[1]] = 0;
      return newBoard;
    }
  }
};
</script>

<style>
.board {
  display: grid;
  grid-template-columns: repeat(8, 50px);
}

.cell {
  width: 50px;
  height: 50px;
  background-color: lightgray;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player {
  color: blue;
}

.ai {
  color: red;
}
</style>