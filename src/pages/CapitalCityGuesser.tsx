import Card from '../components/Card';
import CountryProgress from '../components/CountryProgress';
import { useCapitalCityGame } from '../hooks/useCapitalCityGame';
import styles from './CapitalCityGuesser.module.css';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const CapitalCityGuesser = () => {
  const { 
    question, 
    options, 
    isCorrect, 
    guess, 
    correctAnswer, 
    selectedAnswer, 
    currentCountryPoints,
    activeCountries,
    resetProgress
  } = useCapitalCityGame();

  const [isSPressed, setIsSPressed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        setIsSPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        setIsSPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setShowConfetti(false);
  }, [question]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, question]);

  useEffect(() => {
    if (isCorrect) {
      const correctButton = document.querySelector(`.${styles.correctOption}`) as HTMLElement;
      if (correctButton) {
        const rect = correctButton.getBoundingClientRect();
        setConfettiConfig({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });
      }
      setShowConfetti(true);
    }
  }, [isCorrect]);

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      if (isSPressed && option === correctAnswer) {
        return `${styles.option} ${styles.highlightedOption}`;
      }
      return styles.option;
    }
    if (option === correctAnswer && isCorrect) return `${styles.option} ${styles.correctOption}`;
    if (option === selectedAnswer && !isCorrect) return `${styles.option} ${styles.wrongOption}`;
    return styles.option;
  };

  return (
    <div className={styles.container}>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={100}
          width={confettiConfig.width}
          height={confettiConfig.height}
          tweenDuration={3000}
          initialVelocityX={4}
          initialVelocityY={10}
          gravity={0.3}
          style={{
            position: 'fixed',
            left: confettiConfig.x,
            top: confettiConfig.y,
            width: confettiConfig.width,
            height: confettiConfig.height,
            pointerEvents: 'none'
          }}
        />
      )}
      <h1 className={styles.title}>Capital City Guesser</h1>
      <p className={styles.subtitle}>Test your knowledge of world capitals!</p>
      <div className={styles.gameLayout}>
        <Card>
          <h2 className={styles.title}>Question:</h2>
          <p className={`${styles.question} ${isCorrect ? styles.correct : ''}`}>
            {question}
            <span className={styles.points}> (Knowledge Points: {currentCountryPoints})</span>
          </p>
          <div className={styles.optionsGrid}>
            {options?.map((option) => (
              <button
                key={option}
                onClick={() => guess(option)}
                className={getButtonClass(option)}
                disabled={isCorrect}
              >
                {option}
              </button>
            ))}
          </div>
        </Card>
        <CountryProgress countries={activeCountries} onReset={resetProgress} />
      </div>
    </div>
  )
}

export default CapitalCityGuesser;