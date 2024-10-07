import { useEffect, useState } from 'react';
import styles from './game.module.css';
import Game from './Game';

const CharacterSelection = () => {
  // Converted DOM element handling to state or refs in React
  const [profilePicture, setProfilePicture] = useState<string>(
    './assets/game-assets/default_profile.png'
  );
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  ); // State to manage selected character
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
    'sns1',
  ];

  const totalCharacters = characterNames.length;

  // Function to handle character selection
  const selectCharacter = (characterIndex: number) => {
    setSelectedCharacter(characterIndex);
    setCharacterName(characterNames[characterIndex - 1]);
  };

  const handleConfirmCharacter = () => {
    if (selectedCharacter !== null) {
      // Update profile picture and show the Start Game button
      setProfilePicture(
        `./assets/game-assets/characters/character${selectedCharacter}.png`
      );
      setShowStartGameButton(true);
      setShowModal(false);
    } else {
      alert('Please select a character before starting the game.');
    }
  };

  useEffect(() => {
    // Simulate showing the modal on page load
    // In a real app, the modal display can be controlled via state
    const modal = document.getElementById('character-selection-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }, []);

  const handleStartGame = () => {
    //setShowModal(false);
  };

  return (
    <>
      <h1>DRAGGIN KARMA POINTS</h1>
      <h2>quest of the paladin wizards</h2>

      {/* Game Content Section
        <section id={styles.gameContent}>
          <div id={styles.gameStoryContainer}>
            <div id={styles.npcDialogue}>
              <p id={styles.gameStory}></p>
            </div>
            {/* <img id={styles.gameImage} src="" alt="Game Image" />
          </div>
          <div id={styles.gameChoices}></div>
          {showStartGameButton && (
            <button onClick={handleStartGame} className={styles.actionButton}>
              Start Game
            </button>
          )}
        </section> */}
      <Game />

      {/* Inventory and Player Info Section */}
      <aside id={styles.inventoryContainer}>
        <div id={styles.playerInfo}>
          <img
            id={styles.profilePicture}
            src={profilePicture}
            alt="Profile Picture"
          />
          <h3 id={styles.characterName}>{characterName}</h3>
          <p>
            Karma Level: <span id={styles.karmaLevel}>0</span>
          </p>
        </div>
        <div id={styles.inventory}>
          <h3>Inventory</h3>
          <ul id={styles.inventoryList}></ul>
        </div>
      </aside>

      {/* Character Selection Modal */}
      {showModal ? (
        <>
          <div id={styles.characterSelectionModal} className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Select Your DPW</h2>
              <div id={styles.characterGrid}>
                {Array.from({ length: totalCharacters }).map((_, i) => (
                  <div
                    key={i + 1}
                    className={`${styles.characterWrapper} ${
                      selectedCharacter === i + 1 ? 'selected' : ''
                    }`}
                    onClick={() => selectCharacter(i + 1)}
                  >
                    <img
                      src={`./assets/game-assets/characters/character${
                        i + 1
                      }.png`}
                      alt={`Character ${i + 1}`}
                    />
                    <p className={styles.characterName}>{characterNames[i]}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirmCharacter}
                id={styles.confirmCharacter}
                className={styles.actionButton}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CharacterSelection;
