import { useState } from 'react'
import { Game, GridName, GameMode, GameDifficulty } from './game'

function App() {
  const xIcon = '<path d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z"/>'
  const oIcon = '<path d="M480.14-55Q392-55 314.51-88.08q-77.48-33.09-135.41-91.02-57.93-57.93-91.02-135.27Q55-391.72 55-479.86 55-569 88.08-646.49q33.09-77.48 90.86-134.97 57.77-57.48 135.19-91.01Q391.56-906 479.78-906q89.22 0 166.83 33.45 77.6 33.46 135.01 90.81t90.89 134.87Q906-569.34 906-480q0 88.28-33.53 165.75t-91.01 135.28q-57.49 57.8-134.83 90.89Q569.28-55 480.14-55Zm-.14-94q138 0 234.5-96.37T811-480q0-138-96.5-234.5t-235-96.5q-137.5 0-234 96.5t-96.5 235q0 137.5 96.37 234T480-149Zm0-331Z"/>'
  
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SOLO)
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.HARD)

  let player = 1

  function xWinsSetter(): void {
    const XWinsElement = document.getElementById('xWins');
    const announcementsElement = document.getElementById('announcements');
    if (XWinsElement) {
      const currentWins = parseInt(XWinsElement.textContent || '0', 10);
      const newWins = currentWins + 1;
      XWinsElement.textContent = newWins.toString();
      announcementsElement!.textContent = 'X WINS! (Click to reset)'
    }
  }

  function oWinsSetter(): void {
    const oWinsElement = document.getElementById('oWins');
    const announcementsElement = document.getElementById('announcements');
    if (oWinsElement) {
      const currentWins = parseInt(oWinsElement.textContent || '0', 10);
      const newWins = currentWins + 1;
      oWinsElement.textContent = newWins.toString();
      announcementsElement!.textContent = 'O WINS! (Click to reset)'
    }
  }
  
  const game = new Game(xWinsSetter, oWinsSetter)
  
  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let winner = game.playMove(e.currentTarget.id as GridName, gameMode, difficulty)
    const cursorBall = document.querySelector('.cursor') as HTMLElement;

    if (gameMode === GameMode.MULTIPLAYER) {
      if (player === 1) {
        cursorBall.querySelector('svg')!.innerHTML = oIcon;
        player = 2
      } else {
        cursorBall.querySelector('svg')!.innerHTML = xIcon;
        player = 1
      }
      console.log(player)
    }

    if (winner === 1) {
      game.restart();
    } else if (winner === 2) {
      game.restart();
    } else if (winner === -1) {
      game.restart();
    }
  };

  const handleModeClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const cursorBall = document.querySelector('.cursor') as HTMLElement;
    cursorBall.querySelector('svg')!.innerHTML = xIcon;

    game.restart()

    if (e.currentTarget.id === 'SOLO') {
      setGameMode(GameMode.SOLO)
    } else {
      setGameMode(GameMode.MULTIPLAYER)
    }
  }

  const handleRestartClick = () => {
    game.restart()
  }

  const handleDifficultyClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (e.currentTarget.id === 'EASY') {
      setDifficulty(GameDifficulty.EASY)
    } else if (e.currentTarget.id === 'MED') {
      setDifficulty(GameDifficulty.MEDIUM)
    } else {
      setDifficulty(GameDifficulty.HARD)
    }

    game.restart()
  }

  document.addEventListener('DOMContentLoaded', () => {
    const cursorBall = document.querySelector('.cursor') as HTMLElement;
    cursorBall.querySelector('svg')!.innerHTML = xIcon;
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.2; 

    function updateBallPosition() {
        const dx = mouseX - ballX - 24;
        const dy = mouseY - ballY - 24;

        ballX += dx * speed;
        ballY += dy * speed;

        cursorBall.style.transform = `translate(${ballX}px, ${ballY}px)`;

        requestAnimationFrame(updateBallPosition);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const gridBoxes = document.querySelectorAll('.gridBox');
    gridBoxes.forEach(box => {
      box.addEventListener('mouseover', () => {
        cursorBall.querySelector('svg')!.style.transform = 'scale(1.5)';
      });
      box.addEventListener('mouseout', () => {
        cursorBall.querySelector('svg')!.style.transform = 'scale(1)';
      });
    });

    updateBallPosition();
});

  return (
    <main className='h-svh w-svw flex flex-col sm:flex-row bg-black'>
      <div className='hidden cursor fixed top-0 left-0 pointer-events-none sm:block'>
        <svg viewBox="0 -960 960 960" className='w-12 h-12 fill-notWhite'></svg>
      </div>
      <nav className='h-fit w-full flex justify-center items-center mb-4 sm:mb-0 sm:h-full sm:w-1/2'>
        <div className='h-full w-full flex flex-col justify-end items-start text-notWhite p-2'>
          <h1 className='font-normal text-6xl sm:text-9xl '><a href='' className='hover:cursor-none'>TICTACTOE</a></h1>
          <h2 className={`font-normal text-6xl sm:text-9xl`}>X SCORE: <span id='xWins' className='italic'>0</span></h2>
          <h2 className={`font-normal text-6xl sm:text-9xl`}>O SCORE: <span id='oWins' className='italic'>0</span></h2>
          <div className={`font-normal text-6xl sm:text-9xl flex flex-row text-notWhite-dark`}>
            <h2 id='EASY' onClick={handleDifficultyClick} className={`italic-hover hover:text-notWhite ${difficulty === GameDifficulty.EASY ? 'text-notWhite italic' : ''}`}>EASY</h2>-
            <h2 id='MED' onClick={handleDifficultyClick} className={`italic-hover hover:text-notWhite ${difficulty === GameDifficulty.MEDIUM ? 'text-notWhite italic' : ''}`}>MED</h2>-
            <h2 id='HARD' onClick={handleDifficultyClick} className={`italic-hover hover:text-notWhite ${difficulty === GameDifficulty.HARD ? 'text-notWhite italic' : ''}`}>HARD</h2>
          </div>
          <h2 id='SOLO' className={`font-normal text-6xl sm:text-9xl italic-hover ${gameMode === GameMode.SOLO ? 'italic' : ''}`} onClick={handleModeClick}>SINGLEPLAYER</h2>
          <h2 id='MULTI' className={`font-normal text-6xl sm:text-9xl italic-hover ${gameMode === GameMode.MULTIPLAYER ? 'italic' : ''}`} onClick={handleModeClick}>MULTIPLAYER</h2>
          <h2 className={`font-normal text-6xl sm:text-9xl italic-hover`} onClick={handleRestartClick}>RESET BOARD</h2>
        </div>
      </nav>
      <section className='h-full w-full sm:h-full sm:w-1/2 flex flex-col justify-center items-center'>
        <div id='board' className='w-11/12 sm:w-9/12 mb-1 sm:mb-4 aspect-square flex '>
          <div className='w-1/3 h-full'>
            <div onClick={handleBoxClick} id='ONE' className='gridBox w-full h-1/3 p-2 '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='FOUR' className='gridBox w-full h-1/3 p-2 border-y-8 border-notWhite '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='SEVEN' className='gridBox w-full h-1/3 p-2 '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>

          </div>
          <div className='w-1/3 h-full'>
            <div onClick={handleBoxClick} id='TWO' className='gridBox w-full h-1/3 p-2 border-x-8 border-notWhite '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='FIVE' className='gridBox w-full h-1/3 p-2 border-8 border-notWhite '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='EIGHT' className='gridBox w-full h-1/3 p-2 border-x-8 border-notWhite '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
          
          </div>
          <div className='w-1/3 h-full'>
            <div onClick={handleBoxClick} id='THREE' className='gridBox w-full h-1/3 p-2 '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='SIX' className='gridBox w-full h-1/3 p-2 border-y-8 border-notWhite '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>
            <div onClick={handleBoxClick} id='NINE' className='gridBox w-full h-1/3 p-2 '><svg viewBox="0 -960 960 960" className='w-full h-full fill-notWhite'></svg></div>

          </div>
        </div>
        <div className='h-4 '>
          <p id='announcements' className='text-notWhite sm:text-2xl'></p>
        </div>
      </section>
    </main>
  )
}

export default App
