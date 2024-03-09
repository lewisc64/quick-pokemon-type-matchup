import TypeViewText from './TypeViewText';

const YourTypeReadout = ({ selectedTypes }) => {
  return (
    <p>
      You are a{'aeiou'.includes(selectedTypes[0].name[0]) ? 'n' : ''}{' '}
      {selectedTypes.map((x) => (
        <>
          <TypeViewText key={x.name} type={x} />{' '}
        </>
      ))}
      Pok&eacute;mon!
    </p>
  );
};

export default YourTypeReadout;
