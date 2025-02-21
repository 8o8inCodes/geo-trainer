import { useState, useCallback } from 'react';

// Sample data - in a real app, this would come from an API or larger dataset
const COUNTRIES_DATA = [
  { country: 'France', capital: 'Paris' },
  { country: 'Germany', capital: 'Berlin' },
  { country: 'Spain', capital: 'Madrid' },
  { country: 'Italy', capital: 'Rome' },
  { country: 'United Kingdom', capital: 'London' },
  { country: 'Portugal', capital: 'Lisbon' },
  { country: 'Netherlands', capital: 'Amsterdam' },
  { country: 'Belgium', capital: 'Brussels' }
];

interface GameQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateQuestion = (): GameQuestion => {
  const countries = shuffleArray(COUNTRIES_DATA);
  const mainCountry = countries[0];
  
  // Get 3 random wrong answers
  const wrongAnswers = countries
    .slice(1, 4)
    .map(c => c.capital);
  
  const options = shuffleArray([...wrongAnswers, mainCountry.capital]);
  
  return {
    question: `What is the capital city of ${mainCountry.country}?`,
    options,
    correctAnswer: mainCountry.capital
  };
};

export const useCapitalCityGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion>(() => generateQuestion());
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const generateNewQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion());
    setIsCorrect(false);
    setSelectedAnswer(null);
  }, []);

  const guess = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    }
    // Remove the else case to allow continued guessing
  }, [currentQuestion, generateNewQuestion]);

  return {
    question: currentQuestion.question,
    options: currentQuestion.options,
    correctAnswer: currentQuestion.correctAnswer,
    isCorrect,
    selectedAnswer,
    guess
  };
};