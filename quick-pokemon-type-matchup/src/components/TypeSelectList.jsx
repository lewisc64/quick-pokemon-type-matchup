import { useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/react';
import { MAXIMUM_TYPES_SELECTED } from '../constants';
import TypeViewButton from './TypeViewButton';

const TypeSelectList = ({ types, updateSelectedTypes }) => {
  const [selected, setSelected] = useState([]);

  const toggleSelected = useCallback((type) => {
    setSelected((previous) => {
      let newSelected = [];

      if (previous.includes(type)) {
        newSelected = previous.filter((x) => x.name != type.name);
      } else {
        newSelected = [...previous, type];
      }

      if (newSelected.length > MAXIMUM_TYPES_SELECTED) {
        newSelected = newSelected.slice(1);
      }

      return newSelected;
    });
  }, []);

  useEffect(() => {
    updateSelectedTypes(selected);
  }, [selected]);

  return (
    <ul
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 0;
      `}
    >
      {Object.values(types).map((x) => (
        <li key={x.name}>
          <TypeViewButton
            type={x}
            selected={selected.includes(x)}
            clickCallback={toggleSelected}
          />
        </li>
      ))}
    </ul>
  );
};

export default TypeSelectList;
