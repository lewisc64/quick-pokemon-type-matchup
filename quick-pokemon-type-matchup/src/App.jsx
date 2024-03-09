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
      const response = await fetch('/types.json');
      setTypes(await response.json());
    }
    fetchData();
  }, []);

  return (
    <div
      css={css`
        display: flex;
        grid-column-gap: 1rem;
      `}
    >
      <div
        css={css`
          position: sticky;
          left: 0;
          top: 0;
          width: 14rem;
          height: 100vh;
          overflow-y: scroll;
          @media screen and (max-width: 1000px) {
            width: 7rem;
          }
        `}
      >
        <TypeSelectList types={types} updateSelectedTypes={setSelectedTypes} />
      </div>
      <Information types={types} selectedTypes={selectedTypes} />
    </div>
  );
}

export default App;
