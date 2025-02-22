import { useState, useCallback, useEffect } from 'react';
import countriesData from './countriesByCapital.json';
import toast from 'react-hot-toast';

interface CountryData {
  country: string;
  city: string;
}

interface CountryProgress {
  country: string;
  points: number;
  lastAsked?: number;
}

interface GameQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  country: string;
}

interface StorageData {
  progress: CountryProgress[];
  activeCountries: CountryData[];
}

interface StorageState {
  version: number;
  data: StorageData;
}

const INITIAL_COUNTRIES_COUNT = 5;
const NEXT_COUNTRIES_BATCH = 3;
const POINTS_INCREASE = 2;
const POINTS_DECREASE = 3;
const HIGH_KNOWLEDGE_THRESHOLD = 8;
const MIN_POINTS = 0;
const QUEUE_SIZE = 5;
const STORAGE_VERSION = 1;
const STORAGE_KEY = 'geoTrainer';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Filter out countries with no capital city
const validCountries = countriesData.filter(country => country.city !== null) as CountryData[];

// Helper functions for storage
const saveToStorage = (data: StorageData) => {
  const storageData: StorageState = {
    version: STORAGE_VERSION,
    data: data
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
};

const loadFromStorage = (): StorageData | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const parsed = JSON.parse(saved) as StorageState;
  if (parsed.version !== STORAGE_VERSION) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return parsed.data;
};

export const useCapitalCityGame = () => {
  const [progress, setProgress] = useState<CountryProgress[]>(() => {
    const saved = loadFromStorage();
    return saved?.progress || [];
  });

  const [activeCountries, setActiveCountries] = useState<CountryData[]>(() => {
    const saved = loadFromStorage();
    if (saved?.activeCountries) {
      return saved.activeCountries;
    }
    const initialCountries = shuffleArray(validCountries).slice(0, INITIAL_COUNTRIES_COUNT);
    return initialCountries;
  });

  const [recentlyAskedCountries, setRecentlyAskedCountries] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion>();
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const addToRecentlyAsked = useCallback((country: string) => {
    setRecentlyAskedCountries(prev => {
      const newQueue = [country, ...prev.filter(c => c !== country)];
      return newQueue.slice(0, QUEUE_SIZE);
    });
  }, []);

  const generateNewQuestion = useCallback(() => {
    const sortedByPoints = [...activeCountries].sort((a, b) => {
      const aProgress = progress.find(p => p.country === a.country) || { points: 0 };
      const bProgress = progress.find(p => p.country === b.country) || { points: 0 };
      return aProgress.points - bProgress.points;
    });

    const lowestScoringCountries = sortedByPoints.slice(0, 5);
    const availableCountries = lowestScoringCountries.filter(
      c => !recentlyAskedCountries.includes(c.country)
    );
    
    let selectedCountry;
    if (availableCountries.length === 0) {
      selectedCountry = lowestScoringCountries[Math.floor(Math.random() * lowestScoringCountries.length)];
      setRecentlyAskedCountries([selectedCountry.country]);
    } else {
      selectedCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
      addToRecentlyAsked(selectedCountry.country);
    }

    const otherCountries = validCountries
      .filter(c => c.country !== selectedCountry.country)
      .slice(0, 20);
    const wrongAnswers = shuffleArray(otherCountries)
      .slice(0, 3)
      .map(c => c.city);
    
    const options = shuffleArray([...wrongAnswers, selectedCountry.city]);
    
    const newQuestion = {
      question: `What is the capital city of ${selectedCountry.country}?`,
      options,
      correctAnswer: selectedCountry.city,
      country: selectedCountry.country
    };

    setCurrentQuestion(newQuestion);
    setIsCorrect(false);
    setSelectedAnswer(null);
  }, [progress, activeCountries, recentlyAskedCountries, addToRecentlyAsked]);

  const checkAndExpandCountries = useCallback(() => {
    const allHighKnowledge = activeCountries.every(country => {
      const countryProgress = progress.find(p => p.country === country.country);
      return (countryProgress?.points || 0) >= HIGH_KNOWLEDGE_THRESHOLD;
    });

    if (allHighKnowledge) {
      const existingCountries = new Set(activeCountries.map(c => c.country));
      const availableNewCountries = validCountries.filter(c => !existingCountries.has(c.country));
      
      if (availableNewCountries.length > 0) {
        const newCountries = shuffleArray(availableNewCountries).slice(0, NEXT_COUNTRIES_BATCH);
        setActiveCountries(prev => [...prev, ...newCountries]);
        setRecentlyAskedCountries([]);
        
        // Show toast notification
        toast.success(`Well done! ${NEXT_COUNTRIES_BATCH} new countries added to your quiz!`, {
          duration: 4000,
          position: 'bottom-center',
          style: {
            background: '#2D3748',
            color: '#E2E8F0',
            border: '1px solid #4A5568'
          },
        });
      }
    }
  }, [progress, activeCountries]);

  useEffect(() => {
    saveToStorage({
      progress,
      activeCountries
    });
  }, [progress, activeCountries]);

  useEffect(() => {
    checkAndExpandCountries();
  }, [checkAndExpandCountries]);

  useEffect(() => {
    if (!currentQuestion) {
      generateNewQuestion();
    }
  }, [currentQuestion, generateNewQuestion]);

  const updateProgress = useCallback((country: string, correct: boolean) => {
    setProgress(prev => {
      const existing = prev.find(p => p.country === country);
      const newPoints = Math.max(
        MIN_POINTS,
        (existing?.points || 0) + (correct ? POINTS_INCREASE : -POINTS_DECREASE)
      );

      const updated = existing
        ? prev.map(p => p.country === country ? { ...p, points: newPoints, lastAsked: Date.now() } : p)
        : [...prev, { country, points: newPoints, lastAsked: Date.now() }];

      return updated;
    });
  }, []);

  const guess = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    
    const currentCountry = validCountries.find(
      c => c.city === currentQuestion?.correctAnswer
    )?.country;

    if (currentCountry) {
      updateProgress(currentCountry, correct);
    }

    if (correct) {
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    }
  }, [currentQuestion, generateNewQuestion, updateProgress]);

  const getCurrentCountryPoints = useCallback(() => {
    const countryProgress = progress.find(p => p.country === currentQuestion?.country);
    return countryProgress?.points || 0;
  }, [progress, currentQuestion?.country]);

  const getActiveCountriesProgress = useCallback(() => {
    return activeCountries.map(country => ({
      country: country.country,
      points: progress.find(p => p.country === country.country)?.points || 0
    })).sort((a, b) => b.points - a.points);
  }, [activeCountries, progress]);

  return {
    question: currentQuestion?.question,
    options: currentQuestion?.options,
    correctAnswer: currentQuestion?.correctAnswer,
    isCorrect,
    selectedAnswer,
    guess,
    progress,
    activeCountriesCount: activeCountries.length,
    currentCountryPoints: getCurrentCountryPoints(),
    activeCountries: getActiveCountriesProgress()
  };
};