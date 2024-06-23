import { GameDifficulty } from "./game";

const winnerCombinations: number[][][] = [
  [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], 
  [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], 
  [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
]

export class Bot {
  botGrid: number[][];
  lastMoveWasBest: boolean;

  constructor() {
    this.botGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.lastMoveWasBest = true;
  }

  

  public playMove(difficulty: GameDifficulty): number[] {

    switch (difficulty) {
      case GameDifficulty.EASY:
        const emptySpots = this.leftMoves();
        if (emptySpots.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptySpots.length);
          const [row, col] = emptySpots[randomIndex];
          this.botGrid[row][col] = 2;
          return [row, col];
        }
        return [-1, -1];
      case GameDifficulty.MEDIUM:
        if (this.lastMoveWasBest) {
          const emptySpots = this.leftMoves();
          if (emptySpots.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySpots.length);
            const [row, col] = emptySpots[randomIndex];
            this.botGrid[row][col] = 2;
            this.lastMoveWasBest = false;
            return [row, col];
          }
        } else {
          const [row, col] = this.findBestMove();
          this.botGrid[row][col] = 2;
          this.lastMoveWasBest = true;
          return [row, col];
        }
        return [-1, -1];
      case GameDifficulty.HARD:
        const [row, col] = this.findBestMove();
        this.botGrid[row][col] = 2;
        return [row, col];
      default:
        return [-1, -1];
    }
  }
    

  public resetBot(): void {
    this.botGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }

  private leftMoves(): number[][] {
    const moves: number[][] = [];
    for (let i = 0; i < this.botGrid.length; i++) {
      for (let j = 0; j < this.botGrid[i].length; j++) {
        if (this.botGrid[i][j] === 0) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  }

  private checkWinner(): number {
    for (let i = 0; i < winnerCombinations.length; i++) {
      const [a, b, c] = winnerCombinations[i];
      if (this.botGrid[a[0]][a[1]] && this.botGrid[a[0]][a[1]] === this.botGrid[b[0]][b[1]] && this.botGrid[a[0]][a[1]] === this.botGrid[c[0]][c[1]]) {
        return this.botGrid[a[0]][a[1]];
      }
    }
    return 0;
  }

  private findBestMove(): number[] {
    let bestMove = [-1, -1];
    let bestValue = -Infinity;
    let leftMoves = this.leftMoves();
    for (let i = 0; i < leftMoves.length; i++) {
      let [row, col] = leftMoves[i];
      this.botGrid[row][col] = 2;
      let moveValue = this.minimax(false, 0);
      this.botGrid[row][col] = 0;
      if (moveValue > bestValue) {
        bestMove = [row, col];
        bestValue = moveValue;
      }
    }
    return bestMove;
  }

  private minimax(isMaximizing: boolean, depth: number): number {
    let winner = this.checkWinner();
    if (winner === 1) return -10 + depth;
    if (winner === 2) return 10 - depth;
    if (this.leftMoves().length === 0) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      let leftMoves = this.leftMoves();
      for (let i = 0; i < leftMoves.length; i++) {
        let [row, col] = leftMoves[i];
        this.botGrid[row][col] = 2;
        best = Math.max(best, this.minimax(false, depth + 1));
        this.botGrid[row][col] = 0;
      }
      return best;
    } else {
      let best = Infinity;
      let leftMoves = this.leftMoves();
      for (let i = 0; i < leftMoves.length; i++) {
        let [row, col] = leftMoves[i];
        this.botGrid[row][col] = 1;
        best = Math.min(best, this.minimax(true, depth + 1));
        this.botGrid[row][col] = 0;
      }
      return best;
    }
  }
}