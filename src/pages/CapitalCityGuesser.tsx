import Card from '../components/Card';
import { useCapitalCityGame } from '../hooks/useCapitalCityGame';
import styles from './CapitalCityGuesser.module.css';

const CapitalCityGuesser = () => {
  const { question, options, isCorrect, guess, correctAnswer, selectedAnswer } = useCapitalCityGame();

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) return styles.option;
    if (option === correctAnswer && isCorrect) return `${styles.option} ${styles.correctOption}`;
    if (option === selectedAnswer && !isCorrect) return `${styles.option} ${styles.wrongOption}`;
    return styles.option;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Capital City Guesser</h1>
      <p className={styles.subtitle}>Test your knowledge of world capitals!</p>
      <Card>
        <h2 className={styles.title}>Question:</h2>
        <p className={`${styles.question} ${isCorrect ? styles.correct : ''}`}>
          {question}
        </p>
        <div className={styles.optionsGrid}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => guess(option)}
              className={getButtonClass(option)}
              disabled={isCorrect} // Only disable buttons when correct answer is selected
            >
              {option}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default CapitalCityGuesser