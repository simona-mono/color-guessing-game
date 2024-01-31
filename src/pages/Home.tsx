import { useEffect, useState } from 'react';
import Grid from '../components/Grid';
import Square from '../components/Square';
import DifficultyBtn from '../components/buttons/DifficultyBtn';
import Header from '../components/Header';
import NewGameBtn from '../components/buttons/NewGameBtn';

export default function Home() {
  const [colors, setColors] = useState<string[]>([]);
  const [secretIndex, setSecretIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<string>('start');
  const [difficulty, setDifficulty] = useState<number>(9);

  const headerBackground = gameState === 'won' ? colors[secretIndex] : 'steelblue';
  const newGameText = gameState === 'won' ? 'New game?' : 'New colors';
  const message = gameState === 'won' ? 'Correct :)' : gameState === 'wrong' ? 'Wrong :(' : '';

  useEffect(() => {
    newGame();
  }, [difficulty]); // re-start game when changing difficulty

  const generateColors = (difficultyNum: number) => {
    const newColors: string[] = [];
    const generatedColors: Set<string> = new Set();

    while (newColors.length < difficultyNum) {
      const color = randomColor();
      if (!generatedColors.has(color)) {  // check that there are no duplicate colors
        newColors.push(color);
        generatedColors.add(color);
      }
    }

    return newColors;
  };

  const randomColor = () => {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  };

  const handleColorClick = (i: number) => {
    if (gameState === 'won') return;

    const newColors = colors.map((color, index) => (index === i && color !== colors[secretIndex]) ? 'none' : color);
    const newGameState = (i === secretIndex) ? 'won' : 'wrong';

    if (newGameState === 'won') {
      newColors.fill(colors[secretIndex]);
    }

    setColors(newColors);
    setGameState(newGameState);
  };

  const changeDifficulty = (newDifficulty: number) => {
    setDifficulty(newDifficulty);
  };

  const newGame = () => {
    const newColors = generateColors(difficulty);
    const newSecretIndex = Math.floor(Math.random() * difficulty);
    setColors(newColors);
    setSecretIndex(newSecretIndex);
    setGameState('start');
  };

  return (
    <div className='flex flex-col h-screen'>
       {/* Header */}
       <Header title={colors[secretIndex]} backgroundColor={headerBackground} />

      {/* Action Buttons */}
      <div className="flex justify-center bg-white text-customblue-50">
        <NewGameBtn onClick={newGame} text={newGameText} />
        <span className="text-center text-black w-56">{message}</span>
        <DifficultyBtn
          active={difficulty === 3}
          onClick={() => changeDifficulty(3)}
          text="EASY"
        />
        <DifficultyBtn
          active={difficulty === 9}
          onClick={() => changeDifficulty(9)}
          text="HARD"
        />
      </div>

      {/* Main Content */}
      <main className='h-full bg-gray-800'>
        <div className='max-w-2xl py-8 mx-auto'>
          <Grid col={'grid-cols-3'} gap={'gap-4'}>
            {colors.map((c, i) => (
              <Square key={i} color={c} onClick={() => handleColorClick(i)} />
            ))}
          </Grid>
        </div>
      </main>
    </div>
  );
}