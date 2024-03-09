import { css } from '@emotion/react';

const TypeViewText = ({ type }) => {
  return (
    <span
      css={css`
        border-radius: 0.25rem;
        color: ${type.color};
        filter: drop-shadow(0px 0px 8px ${type.color});
      `}
    >
      {type.name.toUpperCase()}
    </span>
  );
};

export default TypeViewText;
