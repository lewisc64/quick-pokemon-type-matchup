import { css } from '@emotion/react';

const DamageNumber = ({ damage, types }) => {
  let style;
  if (types.length == 1) {
    style = { color: types[0].color };
  } else {
    style = {};
  }
  style.filter = `brightness(${Math.min(
    100 - (100 - damage * 100) / 1.75,
    100
  )}%)`;
  return (
    <span
      css={css`
        color: white;
        font-weight: bold;
      `}
      style={style}
    >
      {damage}x
    </span>
  );
};

export default DamageNumber;
