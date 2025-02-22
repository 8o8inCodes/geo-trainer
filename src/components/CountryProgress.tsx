import styles from './CountryProgress.module.css';

interface CountryProgressProps {
  countries: Array<{
    country: string;
    points: number;
  }>;
}

const HIGH_KNOWLEDGE_THRESHOLD = 8;

const CountryProgress = ({ countries }: CountryProgressProps) => {
  const sortedCountries = [...countries].sort((a, b) => b.points - a.points);
  const masteredCount = countries.filter(c => c.points >= HIGH_KNOWLEDGE_THRESHOLD).length;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Active Countries</h2>
      <div className={styles.summary}>
        <span>Mastered: {masteredCount}/{countries.length}</span>
        <span className={styles.threshold}>Mastery at: {HIGH_KNOWLEDGE_THRESHOLD} points</span>
      </div>
      <div className={styles.countryList}>
        {sortedCountries.map(({ country, points }) => (
          <div 
            key={country} 
            className={`${styles.countryItem} ${points >= HIGH_KNOWLEDGE_THRESHOLD ? styles.highKnowledge : ''}`}
          >
            <span className={styles.countryName}>{country}</span>
            <span className={styles.points}>{points}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryProgress;