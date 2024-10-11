const GroupPhoto = () => {
  const characterNames = [
    'jordan.webp',
    'egido.webp',
    'drogo.webp',
    'ysmys.webp',
    'borovan.webp',
    'smugandcomfy.webp',
    'thyssa.webp',
    'bongwolke.webp',
    'jewel.webp',
    'biketaco.webp',
    'hamish.webp',
    'afat.webp',
    'lordhoochie.webp',
    'corntoshi.webp',
    'snassy.webp',
    'jogu.webp',
    'radu.webp',
    'stipe.webp',
    'wizardly-frog.webp',
    'shilliam.webp',
    'tricky-vic.webp',
    'asdad.webp',
    '420herbalist.webp',
    'spellkaster.webp',
    'realmikejones.webp',
    'chepreghy.webp',
    'passionplanet.webp',
    'scarn.webp',
    'summonsterium.webp',
    'big-v.webp',
    'hood.webp',
    'medium-rare.webp',
    'vmr.webp',
    'infu.webp',
    'JR.webp',
    'contractor33.webp',
    'those-forgotten.webp',
  ];

  const path = 'characters/';

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
        <a key={index}>
          <div className="image-box">
            <img src={`${path}${char}`} alt={char} />
            <p>{char.replace('-', ' ').substring(0, char.indexOf('.'))}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GroupPhoto;
