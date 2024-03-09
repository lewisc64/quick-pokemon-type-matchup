import { css } from '@emotion/react';
import TypeViewText from './TypeViewText';
import DamageNumber from './DamageNumber';

const DamageDisplay = ({ yourTypes, yourDamages, theirTypes, theirDamage }) => {
  return (
    <div>
      <div
        css={css`
          display: inline-block;
          margin-right: 0.2rem;
        `}
      >
        Deal
        {yourDamages.map((damage, i) => (
          <span key={i}>
            {' '}
            <DamageNumber damage={damage} types={[yourTypes[i]]} />
          </span>
        ))}
        , receive <DamageNumber damage={theirDamage} types={[]} />:
      </div>
      <div
        css={css`
          display: inline-block;
        `}
      >
        {theirTypes.map((type, i) => (
          <>
            <TypeViewText key={i} type={type} />
            {i < theirTypes.length - 1 ? ', ' : ''}
          </>
        ))}
      </div>
    </div>
  );
};

export default DamageDisplay;
