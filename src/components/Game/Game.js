import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import Label from '../Label/Label';
import Ranking from '../Ranking/Ranking';
import correctSoundFile from '../../assets/sounds/correct.mp3';
import incorrectSoundFile from '../../assets/sounds/incorrect.mp3';

const correctSound = new Audio(correctSoundFile);
const incorrectSound = new Audio(incorrectSoundFile);

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentSequence, setCurrentSequence] = useState('');
  const [typedLetters, setTypedLetters] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [playerName] = useState(location.state?.playerName || '');
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3); // Estado para o contador regressivo
  const intervalRef = useRef(null);

  const playSound = useCallback((sound) => {
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.log('Playback error:', error);
    });
  }, []);

  const saveScore = useCallback(() => {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const existingPlayer = ranking.find((player) => player.name === playerName);

    if (existingPlayer) {
      if (score > existingPlayer.score) {
        existingPlayer.score = score;
      }
    } else if (score > 0) {
      if (ranking.length < 5) {
        ranking.push({ name: playerName, score: score });
      } else {
        const lowestScorePlayer = ranking.reduce((prev, current) =>
          prev.score < current.score ? prev : current,
        );
        if (score > lowestScorePlayer.score) {
          ranking = ranking.filter(
            (player) => player.name !== lowestScorePlayer.name,
          );
          ranking.push({ name: playerName, score: score });
        }
      }
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
  }, [playerName, score]);

  const generateRandomLetters = useCallback(() => {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const numberOfLetters = 6;

    let randomLetters = '';
    for (let i = 0; i < numberOfLetters; i++) {
      randomLetters += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    setCurrentSequence(randomLetters);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(10);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const newIntervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(newIntervalId);
          setGameOver(true);
          saveScore();
          return 0;
        }
        return prev - 0.01;
      });
    }, 10);
    intervalRef.current = newIntervalId;
  }, [saveScore]);

  const startGame = useCallback(() => {
    generateRandomLetters();
    resetTimer();
    setGameOver(false);
  }, [generateRandomLetters, resetTimer]);

  useEffect(() => {
    // Contador regressivo antes de iniciar o jogo
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else {
      startGame();
    }
  }, [countdown, startGame]);

  const handleKeyPress = useCallback(
    (evt) => {
      if (gameOver) return;
      if (evt.key === 'Enter') return; // Ignorar tecla Enter

      let str = String.fromCharCode(evt.keyCode || evt.which);

      if (!evt.getModifierState('CapsLock')) {
        str = str.toLowerCase();
      }

      if (currentSequence.startsWith(typedLetters + str)) {
        setTypedLetters((prev) => prev + str);
        playSound(correctSound); // Tocar som correto

        if (currentSequence === typedLetters + str) {
          setScore((prevScore) => prevScore + 1);
          setTypedLetters('');
          generateRandomLetters();
          setTimeLeft(10);
        }
      } else {
        playSound(incorrectSound); // Tocar som incorreto
        setGameOver(true);
        saveScore();
        clearInterval(intervalRef.current);
      }
    },
    [
      typedLetters,
      currentSequence,
      generateRandomLetters,
      playSound,
      saveScore,
      gameOver,
    ],
  );

  const handleReset = () => {
    setScore(0);
    setTypedLetters('');
    setGameOver(false);
    setCountdown(3); // Reiniciar o contador regressivo
  };

  const handleNewAccount = () => {
    navigate('/');
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="App">
      {countdown > 0 ? (
        <div id="countdown-overlay">
          <div id="countdown-content">
            <h1>{countdown}</h1>
          </div>
        </div>
      ) : (
        <>
          <div id="tela-preta">
            <Label content={`Jogador: ${playerName}`} />
            <div id="score">Score: {score}</div>
            <div id="game-boxes">
              {currentSequence.split('').map((letter, index) => (
                <div
                  className={`game-box ${
                    typedLetters[index] === letter
                      ? 'correct'
                      : typedLetters[index]
                      ? 'incorrect'
                      : ''
                  }`}
                  key={index}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div id="game-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div id="time-remaining">
              {Math.ceil(timeLeft)} segundos restantes
            </div>
            <button id="game-button" onClick={handleReset}>
              Reiniciar Jogo
            </button>
          </div>
          <div id="tela-rosa"></div>
          <div id="rank">
            <Ranking
              ranking={JSON.parse(localStorage.getItem('ranking')) || []}
            />
          </div>
          {gameOver && (
            <div id="game-over-overlay">
              <div id="game-over-content">
                <h1>Game Over</h1>
                <p>Your final score is {score}.</p>
                <button onClick={handleReset}>Reiniciar Jogo</button>
                <button onClick={handleNewAccount}>Criar Nova Conta</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
