import Card from '../components/Card';
import CountryProgress from '../components/CountryProgress';
import { useCapitalCityGame } from '../hooks/useCapitalCityGame';
import styles from './CapitalCityGuesser.module.css';
import { useState, useEffect, useRef } from 'react';
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
  const [showFullScreenConfetti, setShowFullScreenConfetti] = useState(false);
  const lastShownCountRef = useRef(activeCountries.length);
  const isResetRef = useRef(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleReset = () => {
    isResetRef.current = true;
    lastShownCountRef.current = 5; // Using the initial count value directly
    resetProgress();
  };

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

  useEffect(() => {
    const currentLength = activeCountries.length;
    if (currentLength > lastShownCountRef.current && !isResetRef.current) {
      setShowFullScreenConfetti(true);
      lastShownCountRef.current = currentLength;
      const timer = setTimeout(() => {
        setShowFullScreenConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    isResetRef.current = false;
  }, [activeCountries.length]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {showFullScreenConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.2}
          initialVelocityY={20}
          tweenDuration={4000}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1']}
          confettiSource={{
            x: windowDimensions.width / 2,
            y: windowDimensions.height,
            w: 0,
            h: 0
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        />
      )}
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={150}
          width={confettiConfig.width}
          height={confettiConfig.height}
          tweenDuration={2000}
          initialVelocityX={8}
          initialVelocityY={15}
          gravity={0.4}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1']}
          style={{
            position: 'fixed',
            left: confettiConfig.x,
            top: confettiConfig.y,
            width: confettiConfig.width,
            height: confettiConfig.height,
            pointerEvents: 'none',
            zIndex: 1000
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
        <CountryProgress countries={activeCountries} onReset={handleReset} />
      </div>
    </div>
  )
}

export default CapitalCityGuesser;