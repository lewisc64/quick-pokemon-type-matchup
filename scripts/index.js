function calculateDamageMultiplier(moveType, targetTypes) {
  let multiplier = 1;
  for (const type of targetTypes) {
    if (type.superEffective.includes(moveType.name)) {
      multiplier *= 2;
    } else if (type.notVeryEffective.includes(moveType.name)) {
      multiplier /= 2;
    } else if (type.noEffect.includes(moveType.name)) {
      multiplier *= 0;
    }
  }
  return multiplier;
}

function TypeViewButton({ type, clickCallback, selected }) {
  return (
    <div
      className="type-view"
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
}

function TypeViewText({ type }) {
  return (
    <span className="type-view-text" style={{ backgroundColor: type.color }}>
      {type.name.toUpperCase()}
    </span>
  );
}

function TypeSelectList({ types, setSelected }) {
  const [selected, setSelectedInternal] = React.useState([]);

  function toggleSelected(type) {
    let newSelected = [];
    if (selected.includes(type)) {
      newSelected = selected.filter(x => x.name != type.name);
    } else {
      newSelected = [...selected, type];
    }
    setSelectedInternal(newSelected);
    setSelected(newSelected);
  }

  return (
    <ul className="types">
      {Object.values(types).map(x => (
        <li key={x.name}>
          <TypeViewButton
            type={x}
            selected={selected.includes(x)}
            clickCallback={x => {
              toggleSelected(x);
            }}
          />
        </li>
      ))}
    </ul>
  );
}

function RankingList({ types, selectedTypes, calculateScoreCallback }) {
  let rankingResult = {};

  for (const type of types) {
    let yourDamage = 0;
    let theirDamage = 1;

    for (const otherType of selectedTypes) {
      theirDamage *= calculateDamageMultiplier(otherType, [type]);
      yourDamage = Math.max(
        yourDamage,
        calculateDamageMultiplier(type, [otherType])
      );
    }

    let key = `Deal ${yourDamage}x, receive ${theirDamage}x`;
    if (rankingResult[key] === undefined) {
      rankingResult[key] = {
        score: calculateScoreCallback(yourDamage, theirDamage),
        types: [],
      };
    }

    rankingResult[key].types.push(type);
  }

  const entries = Object.entries(rankingResult)
    .sort((a, b) => (a[1].score > b[1].score ? -1 : 1))
    .filter(([_, value]) => {
      return value.score > 1;
    });

  return entries.length > 0 ? (
    <ol>
      {entries.map(([key, value]) => (
        <li key={key}>
          {key}:{' '}
          {value.types.map(type => (
            <TypeViewText key={type.name} type={type} />
          ))}
        </li>
      ))}
    </ol>
  ) : (
    <p>Nothing.</p>
  );
}

function InformationReadout({ types, selectedTypes }) {
  return selectedTypes.length > 0 ? (
    <section id="info">
      <p>
        You are a{' '}
        {selectedTypes.map(x => <TypeViewText key={x.name} type={x} />)}{' '}
        Pok&eacute;mon!
      </p>
      <h1>You Should Fear:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={(yourDamage, theirDamage) => {
          return theirDamage / yourDamage + theirDamage - 1;
        }}
      />
      <h1>You May Enjoy:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={(yourDamage, theirDamage) => {
          return yourDamage / theirDamage;
        }}
      />
    </section>
  ) : (
    <section id="info">
      <p>Please select some types!</p>
    </section>
  );
}

function Main() {
  const [types, setTypes] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('data/types.json');
      setTypes(await response.json());
    }
    fetchData();
  }, []);

  return (
    <div id="interface">
      <TypeSelectList types={types} setSelected={setSelectedTypes} />
      <InformationReadout types={types} selectedTypes={selectedTypes} />
    </div>
  );
}

ReactDOM.render(<Main />, document.querySelector('main'));
