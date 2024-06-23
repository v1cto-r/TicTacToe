import { Bot } from "./bot";

const winnerCombinations: number[][][] = [
  [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], 
  [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], 
  [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
]

export enum GameMode {
  SOLO,
  MULTIPLAYER
}

export enum GameDifficulty {
  EASY,
  MEDIUM,
  HARD
}

const gridCoordinates = {
  ONE: [0, 0],
  TWO: [0, 1],
  THREE: [0, 2],
  FOUR: [1, 0],
  FIVE: [1, 1],
  SIX: [1, 2],
  SEVEN: [2, 0],
  EIGHT: [2, 1],
  NINE: [2, 2],
} as const;

export type GridName = keyof typeof gridCoordinates
type Coordinate = typeof gridCoordinates[GridName]

export class Game {

  private grid: number[][]
  private xIcon: string
  private oIcon: string
  private hIcon: string
  turn: number
  lastWinner: number
  bot: Bot
  setXWins: () => void
  setOWins: () => void
  tieSetter: () => void

  constructor(setXWins: () => void, setOWins: () => void, tieSetter: () => void) {
    this.grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    this.xIcon = '<path d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z"/>'
    this.oIcon = '<path d="M480.14-55Q392-55 314.51-88.08q-77.48-33.09-135.41-91.02-57.93-57.93-91.02-135.27Q55-391.72 55-479.86 55-569 88.08-646.49q33.09-77.48 90.86-134.97 57.77-57.48 135.19-91.01Q391.56-906 479.78-906q89.22 0 166.83 33.45 77.6 33.46 135.01 90.81t90.89 134.87Q906-569.34 906-480q0 88.28-33.53 165.75t-91.01 135.28q-57.49 57.8-134.83 90.89Q569.28-55 480.14-55Zm-.14-94q138 0 234.5-96.37T811-480q0-138-96.5-234.5t-235-96.5q-137.5 0-234 96.5t-96.5 235q0 137.5 96.37 234T480-149Zm0-331Z"/>'
    this.hIcon = '<path xmlns="http://www.w3.org/2000/svg" d="m479-87-58-52Q312.23-239.12 241.62-311.56 171-384 129-441.5t-58.5-105Q54-594 54-643.1q0-101.22 67.66-169.06T289-880q56.29 0 104.14 24Q441-832 479-785q44-50 90.03-72.5Q615.07-880 669-880q101.38 0 169.19 67.87T906-643q0 48.97-16.5 95.99Q873-500 831-442.5 789-385 718.02-311.95 647.03-238.9 538-139l-59 52Zm-.5-124q100.74-93 165.12-158Q708-434 745.5-482.5t52-86.28q14.5-37.79 14.5-74.05 0-62.17-39.86-102.67T669.71-786q-49.01 0-91.36 32T509-666h-60q-25.75-56-68.93-88-43.18-32-91.13-32-61.21 0-100.58 39.86Q149-706.29 149-642.68q0 37.77 14.94 76.34t52.5 87.46Q254-430 317.5-365.5t161 154.5Zm2.5-288Z"/>'
    this.turn = 1
    this.lastWinner = 0
    this.bot = new Bot()
    this.setXWins = setXWins
    this.setOWins = setOWins
    this.tieSetter = tieSetter
  }

  public getGrid(): number[][] {
    return this.grid
  }

  private coordinateToGridName(row: number, col: number): GridName {
    const index = row * 3 + col;
    return Object.keys(gridCoordinates)[index] as GridName;
  }

  public playMove(gridSquare: GridName, gameMode: GameMode, difficulty: GameDifficulty): number {
    console.log(this.lastWinner)
    if (this.lastWinner !== 0) {
      return this.lastWinner
    }

    const isGridFull = this.grid.every(row => row.every(cell => cell !== 0))
    if (isGridFull) {
      this.lastWinner = -1
      return this.lastWinner
    }

    if (gameMode === GameMode.SOLO) {
      this.playMoveSolo(gridSquare, difficulty)
    } else if (gameMode === GameMode.MULTIPLAYER) {
      this.playMoveMultiplayer(gridSquare)
    }

    return 0
  }

  private playMoveSolo(gridSquare: GridName, difficulty: GameDifficulty): void {
    if (this.turn === 1) {
      const [row, col] = this.getCoordinate(gridSquare)
  
      if (this.grid[row][col] !== 0) {
        return
      }

      const urlParams = new URLSearchParams(window.location.search);
      const icon = urlParams.get('i') === '<3' ? this.hIcon : this.xIcon;
  
      this.grid[row][col] = 1
      this.bot.botGrid[row][col] = 1
      document.getElementById(gridSquare.toString())!.querySelector('svg')!.innerHTML = icon
      this.checkWinner(this.grid)
      this.turn = 2
  
      setTimeout(() => {
        if (this.lastWinner !== 0) {
          return
        }
        let botMove = this.bot.playMove(difficulty)
        this.grid[botMove[0]][botMove[1]] = 2
        document.getElementById((this.coordinateToGridName(botMove[0], botMove[1])).toString())!.querySelector('svg')!.innerHTML = this.oIcon
        this.checkWinner(this.grid)
        this.turn = 1
      }, 300); // Delay of 50ms before executing the bot's move
    }
  }

  private playMoveMultiplayer(gridSquare: GridName): void {
    if (this.turn === 1) {
      const [row, col] = this.getCoordinate(gridSquare)

      if (this.grid[row][col] !== 0) {
        return
      }

      const urlParams = new URLSearchParams(window.location.search);
      const icon = urlParams.get('i') === '<3' ? this.hIcon : this.xIcon;

      this.grid[row][col] = 1
      document.getElementById(gridSquare.toString())!.querySelector('svg')!.innerHTML = icon
      this.checkWinner(this.grid)
      this.turn = 2
    } else {
      const [row, col] = this.getCoordinate(gridSquare)

      if (this.grid[row][col] !== 0) {
        return
      }

      this.grid[row][col] = 2
      document.getElementById(gridSquare.toString())!.querySelector('svg')!.innerHTML = this.oIcon
      this.checkWinner(this.grid)
      this.turn = 1
    }
  }

  private checkWinner(grid: number[][]): void {
    for (let i = 0; i < winnerCombinations.length; i++) {
      const [a, b, c] = winnerCombinations[i]
      if (grid[a[0]][a[1]] && grid[a[0]][a[1]] === grid[b[0]][b[1]] && grid[a[0]][a[1]] === grid[c[0]][c[1]]) {
        if (grid[a[0]][a[1]] === 1) {
          this.lastWinner = 1
          this.setXWins()
          return
        } else {
          this.lastWinner = 2
          this.setOWins()
          return
        }
      }
    }

    const isGridFull = grid.every(row => row.every(cell => cell !== 0)) 
    if (isGridFull) {
      this.lastWinner = -1
      this.tieSetter()
    }
  }

  public restart(): void {
    this.grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.bot.resetBot();
    this.lastWinner = 0;
    this.turn = 1;

    const announcementsElement = document.getElementById('announcements');
    if (announcementsElement) {
      announcementsElement.textContent = '';
    }

    for (const key in gridCoordinates) {
      document.getElementById(key)!.querySelector('svg')!.innerHTML = ''
    }
  }

  private getCoordinate(gridName: GridName): Coordinate {
    return gridCoordinates[gridName]
  }


}