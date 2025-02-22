import { useState, useEffect } from 'react';
import styles from './CountryProgress.module.css';
import countriesData from '../hooks/countriesByCapital.json';

interface CountryProgressProps {
  countries: Array<{
    country: string;
    points: number;
  }>;
  onReset: () => void;
}

type SortOrder = 'points-desc' | 'points-asc' | 'name';

const HIGH_KNOWLEDGE_THRESHOLD = 8;

const CountryProgress = ({ countries, onReset }: CountryProgressProps) => {
  const [isAPressed, setIsAPressed] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('points-desc');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        setIsAPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        setIsAPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getCapitalCity = (country: string) => {
    return countriesData.find(c => c.country === country)?.city;
  };

  const handleReset = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    onReset();
    setShowConfirmation(false);
  };

  const getSortedCountries = () => {
    const sorted = [...countries];
    switch (sortOrder) {
      case 'points-desc':
        return sorted.sort((a, b) => b.points - a.points);
      case 'points-asc':
        return sorted.sort((a, b) => a.points - b.points);
      case 'name':
        return sorted.sort((a, b) => a.country.localeCompare(b.country));
      default:
        return sorted;
    }
  };

  const getNextSortOrder = (): SortOrder => {
    switch (sortOrder) {
      case 'points-desc':
        return 'points-asc';
      case 'points-asc':
        return 'name';
      case 'name':
        return 'points-desc';
      default:
        return 'points-desc';
    }
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'points-desc':
        return '↓ Points';
      case 'points-asc':
        return '↑ Points';
      case 'name':
        return 'A-Z';
      default:
        return 'Sort';
    }
  };

  const sortedCountries = getSortedCountries();
  const masteredCount = countries.filter(c => c.points >= HIGH_KNOWLEDGE_THRESHOLD).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Active Countries</h2>
        <div className={styles.headerButtons}>
          <button 
            onClick={() => setSortOrder(getNextSortOrder())}
            className={styles.sortButton}
            title="Change sort order"
          >
            {getSortIcon()}
          </button>
          <button 
            onClick={handleReset} 
            className={styles.resetButton}
            title="Reset all progress"
          >
            Reset
          </button>
        </div>
      </div>
      {showConfirmation && (
        <div className={styles.confirmation}>
          <p>Are you sure you want to reset all progress?</p>
          <div className={styles.confirmButtons}>
            <button 
              onClick={confirmReset}
              className={`${styles.resetButton} ${styles.confirmButton}`}
            >
              Yes, reset
            </button>
            <button 
              onClick={() => setShowConfirmation(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className={styles.summary}>
        <span>Mastered: {masteredCount}/{countries.length}</span>
        <span className={styles.threshold}>Mastery at: {HIGH_KNOWLEDGE_THRESHOLD} points</span>
      </div>
      <div className={styles.countryList}>
        {sortedCountries.map(({ country, points }) => (
          <div 
            key={country} 
            className={`${styles.countryItem} ${points >= HIGH_KNOWLEDGE_THRESHOLD ? styles.highKnowledge : ''}`}
            onMouseEnter={() => setHoveredCountry(country)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <span className={styles.countryName}>{country}</span>
            <div className={styles.rightContent}>
              <span className={styles.points}>{points}</span>
              {isAPressed && hoveredCountry === country && (
                <span className={styles.tooltip}>
                  Capital: {getCapitalCity(country)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryProgress;