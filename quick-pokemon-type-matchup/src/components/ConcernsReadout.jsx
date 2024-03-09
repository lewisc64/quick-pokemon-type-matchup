import { useCallback } from 'react';
import RankingList from './RankingList';

const ConcernsReadout = ({ types, selectedTypes }) => {
  const fearScoreCallback = useCallback((yourDamage, theirDamage) => {
    return theirDamage / yourDamage + theirDamage - 1;
  }, []);

  const enjoyScoreCallback = useCallback((yourDamage, theirDamage) => {
    return yourDamage / theirDamage;
  }, []);

  return (
    <div>
      <h1>You Should Fear:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={fearScoreCallback}
      />
      <h1>You May Enjoy:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={enjoyScoreCallback}
      />
    </div>
  );
};

export default ConcernsReadout;
