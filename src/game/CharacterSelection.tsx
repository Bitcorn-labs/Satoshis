import React, { useEffect, useRef, useState } from 'react';
import styles from './game.module.css';
import Game from './Game';
import { Link } from 'react-router-dom';

interface CharacterSelectionProps {
  gameCompleted: boolean;
  setGameCompleted: (value: boolean) => void;
  isConnected: boolean;
  handleScrollToLogin: () => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  gameCompleted,
  setGameCompleted,
  isConnected,
  handleScrollToLogin,
}) => {
  const characterNames = [
    '*jordan.webp',
    'drogo.webp',
    'ysmys.webp',
    'bort.webp',
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
    '*egido.webp',
    'radude.webp',
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
    '889.webp',
    'those-forgotten.webp',
  ];

  const path = 'characters/';

  const hiddenLorePath = 'hidden-lore/';

  // Converted DOM element handling to state or refs in React
  const [profilePicture, setProfilePicture] = useState<string>(
    path + characterNames[characterNames.length - 1]
  );
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  ); // State to manage selected character test
  const [showModal, setShowModal] = useState<boolean>(true);
  const [showStartGameButton, setShowStartGameButton] =
    useState<boolean>(false);
  const [characterName, setCharacterName] = useState<string>('Paladin Wizard'); // State for character name

  const [showGame, setShowGame] = useState<boolean>(false); // Control to show/hide game content

  const totalCharacters = characterNames.length;

  const startGameSection = useRef<HTMLDivElement | null>(null);
  const topSection = useRef<HTMLDivElement | null>(null);

  // Function to handle character selection
  const selectCharacter = (characterIndex: number) => {
    setSelectedCharacter(characterIndex);
    setCharacterName(
      characterNames[characterIndex - 1]
        .replace('-', ' ')
        .substring(0, characterNames[characterIndex - 1].indexOf('.'))
        .replace('*', '')
    );
    setProfilePicture(
      characterNames[characterIndex - 1].indexOf('*') >= 0
        ? path +
            hiddenLorePath +
            characterNames[characterIndex - 1].replace('*', '')
        : path + characterNames[characterIndex - 1].replace('*', '')
    );
  };

  const handleConfirmCharacter = () => {
    if (selectedCharacter !== null) {
      if (startGameSection.current) {
        startGameSection.current.scrollIntoView({ behavior: 'smooth' });
      }
      // Update profile picture and show the Start Game button
      //setProfilePicture(path + characterNames[selectedCharacter - 1]); //lol
      setShowStartGameButton(true);
      //setShowModal(false);
    } else {
      alert('Please select a character before starting the game.');
    }
  };

  const handleCancelCharacter = () => {
    setProfilePicture(
      path + characterNames[characterNames.length - 1].replace('*', '')
    );
    setCharacterName('Paladin Wizard');
    setSelectedCharacter(null);
    setShowStartGameButton(false);
    if (topSection.current) {
      topSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (topSection.current) {
      topSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleStartGame = () => {
    //setShowModal(false);
  };

  return (
    <>
      <div ref={topSection}></div>
      <h1>DRAGGIN KARMA POINTS</h1>
      <h2>quest of the paladin wizards</h2>

      {/* Character Selection Modal */}
      <>
        <div>
          {!showGame ? (
            <div>
              <h2>Select Your DPW</h2>
              <div className="character-images-container">
                {Array.from({ length: totalCharacters }).map((_, i) => (
                  <div
                    style={{
                      textAlign: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                    key={i + 1}
                    className={`${styles.characterWrapper} ${
                      selectedCharacter === i + 1 ? 'selected' : ''
                    }`}
                    onClick={() => {
                      if (!showStartGameButton) selectCharacter(i + 1);
                    }}
                  >
                    <img
                      src={path + characterNames[i].replace('*', '')}
                      alt={`Character ${i + 1}`}
                      className={`${
                        showStartGameButton && selectedCharacter !== i + 1
                          ? 'greyed-out'
                          : ''
                      }`}
                    />
                    <p
                      style={{
                        display: 'flex',
                        textAlign: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className={`${
                        showStartGameButton && selectedCharacter !== i + 1
                          ? 'greyed-out'
                          : ''
                      } ${styles.characterName}`}
                    >
                      {characterNames[i]
                        .replace('-', ' ')
                        .substring(0, characterNames[i].indexOf('.'))
                        .replace('*', '')}
                    </p>
                  </div>
                ))}
              </div>

              <div ref={startGameSection}></div>

              {showStartGameButton ? (
                <>
                  <button
                    onClick={handleCancelCharacter}
                    className={`cancelCharacter`}
                  >
                    Cancel Selection
                  </button>
                </>
              ) : (
                <>
                  {selectedCharacter && (
                    <>
                      <button
                        onClick={handleConfirmCharacter}
                        className={`cancelCharacter`}
                      >
                        Confirm Selection
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <></>
          )}

          <Game
            profilePicture={profilePicture}
            characterName={characterName}
            showStartGameButton={showStartGameButton}
            showGame={showGame}
            setShowGame={setShowGame}
            gameCompleted={gameCompleted}
            setGameCompleted={setGameCompleted}
            isConnected={isConnected}
            handleScrollToLogin={handleScrollToLogin}
          />

          {/* Inventory and Player Info Section */}
        </div>
        <Link to="/">
          <button style={{ marginTop: '16px' }} className={styles.actionButton}>
            Back to Home
          </button>
        </Link>
      </>
    </>
  );
};

export default CharacterSelection;
