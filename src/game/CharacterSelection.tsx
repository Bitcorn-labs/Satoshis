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
  // Converted DOM element handling to state or refs in React
  const [profilePicture, setProfilePicture] = useState<string>(
    './assets/game-assets/characters/character31.png'
  );
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  ); // State to manage selected character test
  const [showModal, setShowModal] = useState<boolean>(true);
  const [showStartGameButton, setShowStartGameButton] =
    useState<boolean>(false);
  const [characterName, setCharacterName] = useState<string>('Paladin Wizard'); // State for character name
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

  const [showGame, setShowGame] = useState<boolean>(false); // Control to show/hide game content

  const totalCharacters = characterNames.length;

  const startGameSection = useRef<HTMLDivElement | null>(null);
  const topSection = useRef<HTMLDivElement | null>(null);

  // Function to handle character selection
  const selectCharacter = (characterIndex: number) => {
    setSelectedCharacter(characterIndex);
    setCharacterName(characterNames[characterIndex - 1]);
    setProfilePicture(
      `./assets/game-assets/characters/character${characterIndex}.png`
    );
  };

  const handleConfirmCharacter = () => {
    if (selectedCharacter !== null) {
      if (startGameSection.current) {
        startGameSection.current.scrollIntoView({ behavior: 'smooth' });
      }
      // Update profile picture and show the Start Game button
      setProfilePicture(
        `./assets/game-assets/characters/character${selectedCharacter}.png`
      );
      setShowStartGameButton(true);
      //setShowModal(false);
    } else {
      alert('Please select a character before starting the game.');
    }
  };

  const handleCancelCharacter = () => {
    setProfilePicture(`./assets/game-assets/characters/character31.png`);
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
                      src={`./assets/game-assets/characters/character${
                        i + 1
                      }.png`}
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
                      {characterNames[i]}
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
