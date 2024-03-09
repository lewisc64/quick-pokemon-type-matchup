import { css } from '@emotion/react';
import YourTypeReadout from './YourTypeReadout';
import ConcernsReadout from './ConcernsReadout';

const Information = ({ types, selectedTypes }) => {
  return (
    <section
      css={css`
        color: white;
        font-size: 1.2rem;
      `}
    >
      {selectedTypes.length > 0 ? (
        <div>
          <YourTypeReadout selectedTypes={selectedTypes} />
          <ConcernsReadout types={types} selectedTypes={selectedTypes} />
        </div>
      ) : (
        <p>Please select some types!</p>
      )}
    </section>
  );
};

export default Information;
