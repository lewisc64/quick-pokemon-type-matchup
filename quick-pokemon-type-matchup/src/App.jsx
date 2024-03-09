import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import TypeSelectList from './components/TypeSelectList';
import Information from './components/Information';

import './App.css';

function App() {
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('./types.json');
      setTypes(await response.json());
    }
    fetchData();
  }, []);

  return (
    <div
      css={css`
        display: grid;
        grid-column-gap: 1rem;
        grid-template-columns: auto 1fr;
      `}
    >
      <div
        css={css`
          width: 14rem;
          height: 100dvh;
          overflow-y: scroll;
          @media (max-width: 1000px) {
            width: 7rem;
          }
        `}
      >
        <TypeSelectList types={types} updateSelectedTypes={setSelectedTypes} />
      </div>
      <div
        css={css`
          height: 100dvh;
          overflow-y: scroll;
        `}
      >
        <Information types={types} selectedTypes={selectedTypes} />
      </div>
    </div>
  );
}

export default App;
