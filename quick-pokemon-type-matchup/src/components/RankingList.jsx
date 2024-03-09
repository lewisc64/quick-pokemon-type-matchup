import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { calculateDamageMultiplier } from '../utils';
import DamageDisplay from './DamageDisplay';

const RankingList = ({ types, selectedTypes, calculateScoreCallback }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const rankingResult = {};

    for (const type of types) {
      let yourDamageTypes = [];
      let yourDamages = [];
      let yourMaximumDamage = 0;
      let theirDamage = 1;

      for (const otherType of selectedTypes) {
        theirDamage *= calculateDamageMultiplier(otherType, [type]);

        const damage = calculateDamageMultiplier(type, [otherType]);
        yourDamages.push(damage);
        yourDamageTypes.push(otherType);
        yourMaximumDamage = Math.max(yourMaximumDamage, damage);
      }

      let key = `${yourDamages.map((x) => x + 'x').join('')},${theirDamage}x`;
      if (rankingResult[key] === undefined) {
        rankingResult[key] = {
          score: calculateScoreCallback(yourMaximumDamage, theirDamage),
          types: [],
          yourDamageTypes: yourDamageTypes,
          yourDamages: yourDamages,
          theirDamage: theirDamage,
        };
      }

      rankingResult[key].types.push(type);
    }

    setEntries(
      Object.entries(rankingResult)
        .sort((a, b) => (a[1].score > b[1].score ? -1 : 1))
        .filter(([_, value]) => {
          return value.score > 1;
        })
    );
  }, [types, selectedTypes, calculateScoreCallback]);

  return entries.length > 0 ? (
    <ol
      css={css`
        padding: 0;
      `}
    >
      {entries.map(([key, value]) => (
        <li
          css={css`
            list-style: none;
          `}
          key={key}
        >
          <DamageDisplay
            yourTypes={value.yourDamageTypes}
            yourDamages={value.yourDamages}
            theirTypes={value.types}
            theirDamage={value.theirDamage}
          />
        </li>
      ))}
    </ol>
  ) : (
    <p>Nothing.</p>
  );
};

export default RankingList;
