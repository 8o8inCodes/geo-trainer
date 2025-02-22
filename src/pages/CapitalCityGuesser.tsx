import Card from '../components/Card';
import CountryProgress from '../components/CountryProgress';
import { useCapitalCityGame } from '../hooks/useCapitalCityGame';
import styles from './CapitalCityGuesser.module.css';
import { useState, useEffect } from 'react';

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