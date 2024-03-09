import { css } from '@emotion/react';

const TypeViewButton = ({ type, clickCallback, selected }) => {
  return (
    <div
      css={css`
        display: inline-block;
        color: white;
        border: 3px solid white;
        border-radius: 0.5rem;
        line-height: 2.5rem;
        text-align: center;
        width: 6rem;
        height: 2.5rem;
        line-height: 2.5rem;
        user-select: none;
        cursor: pointer;
        margin: 0.2rem;
        font-size: 1.2rem;
        transition: filter 0.1s;
      `}
      style={{
        backgroundColor: type.color,
        filter: selected
          ? 'saturate(100%) brightness(100%)'
          : 'saturate(30%) brightness(30%)',
      }}
      onClick={() => {
        clickCallback(type);
      }}
    >
      {type.name.toUpperCase()}
    </div>
  );
};

export default TypeViewButton;
