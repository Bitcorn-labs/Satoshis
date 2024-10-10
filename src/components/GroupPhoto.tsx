interface TemplateProps {}

const GroupPhoto: React.FC<TemplateProps> = () => {
  const characterNames = [
    'Jordan',
    '420herbalist',
    'afat',
    'asdad',
    'corntoshi',
    'contractor33',
    'borovan',
    'smugandcomfy',
    'drogo',
    'edigo',
    'hood',
    'infu',
    'hamish',
    'stipe',
    'trickyvic',
    'bongwolke',
    'vmr',
    'summonsterium',
    'spellkaster',
    'biketaco',
    'medium rare',
    'thyssa',
    'big v',
    'lordhoochie',
    'realmikejones',
    'snassy',
    'jogu',
    'ysmys',
    'JR',
    'passionplanet',
    'those forgotten',
  ];
  return (
    <div
      className="extra-images-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        minHeight: '100vh', // Make sure it covers the full viewport height
        textAlign: 'center', // Center text if needed
      }}
    >
      {characterNames.map((char, index) => (
        <a
          href={`./assets/game-assets/characters/character${index + 1}.png`}
          key={index}
        >
          <div className="image-box">
            <img
              src={`./assets/game-assets/characters/character${index + 1}.png`}
              alt={char}
            />
            <p>{char}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GroupPhoto;
