const MAXIMUM_TYPES_SELECTED = 2;

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

const TypeViewButton = ({ type, clickCallback, selected }) => {
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
};

const TypeViewText = ({ type }) => {
  return (
    <span className="type-view-text" style={{ backgroundColor: type.color }}>
      {type.name.toUpperCase()}
    </span>
  );
};

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
    <span className={'damage-number'} style={style}>
      {damage}x
    </span>
  );
};

const DamageDisplay = ({ yourTypes, yourDamages, theirTypes, theirDamage }) => {
  return (
    <div className={'damage-display'}>
      <div className={'damage-display-damages'}>
        Deal
        {yourDamages.map((damage, i) => (
          <span key={i}>
            {' '}
            <DamageNumber damage={damage} types={[yourTypes[i]]} />
          </span>
        ))}, receive <DamageNumber damage={theirDamage} types={[]} />:
      </div>
      <div className={'damage-display-types'}>
        {theirTypes.map((type, i) => <TypeViewText key={i} type={type} />)}
      </div>
    </div>
  );
};

const TypeSelectList = ({ types, updateSelectedTypes }) => {
  const [selected, setSelected] = React.useState([]);

  const toggleSelected = React.useCallback(type => {
    setSelected(previous => {
      let newSelected = [];

      if (previous.includes(type)) {
        newSelected = previous.filter(x => x.name != type.name);
      } else {
        newSelected = [...previous, type];
      }

      if (newSelected.length > MAXIMUM_TYPES_SELECTED) {
        newSelected = newSelected.slice(1);
      }

      return newSelected;
    });
  }, []);

  React.useEffect(
    () => {
      updateSelectedTypes(selected);
    },
    [selected]
  );

  return (
    <ul className="types">
      {Object.values(types).map(x => (
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

const RankingList = ({ types, selectedTypes, calculateScoreCallback }) => {
  const [entries, setEntries] = React.useState([]);

  React.useEffect(
    () => {
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

        let key = `${yourDamages.map(x => x + 'x').join('')},${theirDamage}x`;
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
    },
    [types, selectedTypes, calculateScoreCallback]
  );

  return entries.length > 0 ? (
    <ol>
      {entries.map(([key, value]) => (
        <li key={key}>
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

const YourTypeReadout = ({ selectedTypes }) => {
  return (
    <p>
      You are a{'aeiou'.includes(selectedTypes[0].name[0]) ? 'n' : ''}{' '}
      {selectedTypes.map(x => <TypeViewText key={x.name} type={x} />)}{' '}
      Pok&eacute;mon!
    </p>
  );
};

const ConcernsReadout = ({ types, selectedTypes }) => {
  const fearScoreCallback = React.useCallback((yourDamage, theirDamage) => {
    return theirDamage / yourDamage + theirDamage - 1;
  }, []);

  const enjoyScoreCallback = React.useCallback((yourDamage, theirDamage) => {
    return yourDamage / theirDamage;
  }, []);

  return (
    <div>
      <h1>You Should Fear:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={fearScoreCallback}
      />
      <h1>You May Enjoy:</h1>
      <RankingList
        types={types}
        selectedTypes={selectedTypes}
        calculateScoreCallback={enjoyScoreCallback}
      />
    </div>
  );
};

const Information = ({ types, selectedTypes }) => {
  return (
    <section id="info">
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

const Main = () => {
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
      <TypeSelectList types={types} updateSelectedTypes={setSelectedTypes} />
      <Information types={types} selectedTypes={selectedTypes} />
    </div>
  );
};

ReactDOM.render(<Main />, document.querySelector('main'));
