document.addEventListener("DOMContentLoaded", () => {
    const characterGrid = document.getElementById('character-grid');
    const profilePicture = document.getElementById('profile-picture');
    const characterNameDisplay = document.getElementById('character-name');
    const characterSelectionModal = document.getElementById('character-selection-modal');
    const confirmCharacterButton = document.getElementById('confirm-character');
    const startGameButton = document.getElementById('start-game');
    let selectedCharacter = null;

    // Array of character names for each of the 31 characters
    const characterNames = [
        "Jordan", "420herbalist", "afat", "asdad", "corntoshi", "contractor33", "borovan", "smugandcomfy",
        "drogo", "edigo", "hood", "infu", "hamish", "stipe", "trickyvic", "bongwolke",
        "vmr", "summonsterium", "spellkaster", "biketaco", "medium rare", "thyssa", "big v", "lordhoochie", 
        "realmikejones", "snassy", "jogu", "ysmys", "JR", "passionplanet", "sns1"
    ];

    // Load character selections into the grid
    const totalCharacters = 31;
    for (let i = 1; i <= totalCharacters; i++) {
        const characterWrapper = document.createElement('div');
        characterWrapper.classList.add('character-wrapper');

        const characterImg = document.createElement('img');
        characterImg.src = `assets/characters/character${i}.png`;
        characterImg.alt = `Character ${i}`;
        characterImg.classList.add('character-img');
        characterImg.onclick = () => selectCharacter(i, characterWrapper);

        const characterName = document.createElement('p');
        characterName.textContent = characterNames[i - 1];
        characterName.classList.add('character-name');

        characterWrapper.appendChild(characterImg);
        characterWrapper.appendChild(characterName);
        characterGrid.appendChild(characterWrapper);
    }

    // Handle character selection
    function selectCharacter(characterIndex, characterWrapper) {
        selectedCharacter = characterIndex;

        // Highlight the selected character
        document.querySelectorAll('.character-wrapper').forEach(wrapper => wrapper.classList.remove('selected'));
        characterWrapper.classList.add('selected');

        // Display the selected character's name
        characterNameDisplay.textContent = characterNames[characterIndex - 1];
    }

    // Confirm character selection
    confirmCharacterButton.onclick = () => {
        if (selectedCharacter !== null) {
            // Update profile picture with selected character
            profilePicture.src = `assets/characters/character${selectedCharacter}.png`;

            // Close modal and show the Start Game button
            characterSelectionModal.style.display = 'none';
            startGameButton.style.display = 'block';
        } else {
            alert('Please select a character before starting the game.');
        }
    };

    // Show character selection modal when the page loads
    characterSelectionModal.style.display = 'flex';
});
