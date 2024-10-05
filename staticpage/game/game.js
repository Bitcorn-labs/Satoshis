// Expanded Game state to track player's progress, inventory, karma, and side quests
let gameState = {
    inventory: [],        // Holds all items collected by the player
    karmaLevel: 0,        // Karma level tracks the player's positive or negative actions
    questsCompleted: 0,   // Number of completed quests
    hiddenQuestUnlocked: false, // Tracks whether the hidden Soul Gem quest is unlocked
    sideQuestsCompleted: 0 // Tracks side quests completed
};

// DOM elements to interact with the HTML
const gameStory = document.getElementById('game-story');
const gameImage = document.getElementById('game-image');
const gameChoices = document.getElementById('game-choices');
const inventoryList = document.getElementById('inventory-list');
const startButton = document.getElementById('start-game');
const returnHomeButton = document.getElementById('return-home');

// Utility function to update the story and display an image if provided
function updateStory(text, imgSrc) {
    gameStory.textContent = text;
    gameStory.style.display = 'block';
    if (imgSrc) {
        gameImage.src = imgSrc;
        gameImage.style.display = 'block';
    } else {
        gameImage.style.display = 'none';
    }
}

// Utility function to update available choices (buttons)
function updateChoices(choices) {
    gameChoices.innerHTML = ''; // Clear old choices
    gameChoices.style.display = 'block'; // Ensure choices are shown
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.onclick = choice.action;
        gameChoices.appendChild(button);
    });
}

// Utility function to update the player's inventory
function updateInventory() {
    inventoryList.innerHTML = ''; // Clear previous inventory
    gameState.inventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item; // Display each item in the inventory
        inventoryList.appendChild(li);
    });
    document.getElementById('inventory').style.display = 'block'; // Show inventory
}

// Start Game function to initialize the game
function startGame() {
    startButton.style.display = 'none'; // Hide start button once the game begins
    introduction(); // Start the story
}

// Return to Home function to reset the game
function returnToHome() {
    // Reset all game state variables
    gameState = {
        inventory: [],
        karmaLevel: 0,
        questsCompleted: 0,
        hiddenQuestUnlocked: false,
        sideQuestsCompleted: 0
    };
    updateInventory(); // Clear the inventory display
    startButton.style.display = 'block'; // Show the start button again
    gameStory.style.display = 'none'; // Hide the story
    gameImage.style.display = 'none'; // Hide any image
    gameChoices.style.display = 'none'; // Hide choices
}

// Introduction: Initial scene to set up the game world
function introduction() {
    updateStory(
        "Welcome, Paladin Wizard, to Luméira—a land where balance between light and darkness must be restored. You have been chosen to embark on this quest. Your journey begins in the Luminescent Grove, where the Elves await you to discuss the path of karma.",
        "assets/luminescent_grove.jpg"
    );
    updateChoices([
        { text: 'Travel to the Luminescent Grove', action: elvesQuest },
        { text: 'Explore the nearby forest', action: exploreForest }
    ]);
}

// Quest 1: Retrieve the Jewels of Karma from the Elves
function elvesQuest() {
    updateStory(
        "The Elves greet you warmly. Eledrin, their wise leader, approaches with a serene smile. 'Welcome, Paladin Wizard,' he says, his voice calm but filled with ancient wisdom. 'You stand at a crossroad where few are granted passage. The choice before you is profound: will you embrace the Jewels of Positive Karma, to nurture the light within you, or the Jewels of Negative Karma, to wield the power that darkness brings? Remember, your decision will echo through Luméira’s balance.'",
        "assets/elves.jpg"
    );
    updateChoices([
        { text: 'Choose the Jewels of Positive Karma', action: jewelsOfPositiveKarma },
        { text: 'Choose the Jewels of Negative Karma', action: jewelsOfNegativeKarma },
        { text: 'Ignore the Karma path and proceed to the tower', action: skipJewelsAndGoToTower }
    ]);
}

function jewelsOfPositiveKarma() {
    if (!gameState.inventory.includes('Jewels of Positive Karma')) {
        gameState.inventory.push('Jewels of Positive Karma'); // Add item to inventory
        gameState.karmaLevel += 10; // Increase karma level for positive action
        gameState.questsCompleted++; // Track the quest completion
        updateInventory(); // Refresh inventory display
        updateStory(
            "Eledrin smiles warmly as you take the Jewels of Positive Karma, their gentle glow radiating in your hands. 'May these jewels guide you to protect and nurture,' he says, placing a hand on your shoulder. 'Remember, however, that even light can cast shadows. Use your gifts wisely, for every action has its consequence.' The Elves bow, blessing your journey ahead as you sense a newfound strength within.",
            "assets/jewels_positive.jpg"
        );
        offerNextQuest(); // Continue to the next quest
    } else {
        updateStory(
            "You already possess the Jewels of Positive Karma. The Elves remind you to tread carefully, Paladin Wizard, as your path will shape Luméira's future.",
            "assets/elves.jpg"
        );
        offerNextQuest(); // Continue to the next quest
    }
}

function jewelsOfNegativeKarma() {
    if (!gameState.inventory.includes('Jewels of Negative Karma')) {
        gameState.inventory.push('Jewels of Negative Karma'); // Add item to inventory
        gameState.karmaLevel -= 10; // Decrease karma level for negative action
        gameState.questsCompleted++; // Track the quest completion
        updateInventory(); // Refresh inventory display
        updateStory(
            "As you grasp the Jewels of Negative Karma, their shadowy glow pulses in your hand. Eledrin watches, his gaze wary but resolute. 'The power of darkness is formidable, Paladin Wizard,' he says gravely. 'Use it wisely, for it can both empower and consume.' The Elves step back, their expressions mixed with caution and reverence, as you feel a surge of strength and mystery coursing through you.",
            "assets/jewels_negative.jpg"
        );
        offerNextQuest(); // Continue to the next quest
    } else {
        updateStory(
            "You already possess the Jewels of Negative Karma. Eledrin warns you once again to wield your newfound power with care, as darkness can be an unpredictable ally.",
            "assets/elves.jpg"
        );
        offerNextQuest(); // Continue to the next quest
    }
}

function skipJewelsAndGoToTower() {
    updateStory(
        "Choosing neither path, you respectfully bow to the Elves and turn toward the distant tower. 'A unique choice,' Eledrin murmurs, watching you with an unreadable expression. 'May your steps be guided by wisdom.' You feel a sense of resolve as you move forward, knowing that destiny is shaped by each decision, large or small.",
        "assets/castle_tower.jpg"
    );
    goToCastleTower(); // Proceed to the tower quest
}


// Side Quest: Explore the nearby forest for hidden items
function exploreForest() {
    updateStory(
        "As you venture into the forest, you feel the magic in the air. The leaves whisper to you, guiding you to something mysterious deeper within.",
        "assets/forest_path.jpg"
    );
    updateChoices([
        { text: 'Investigate the strange glow in the distance', action: findMagicHerbs },
        { text: 'Return to the Luminescent Grove', action: elvesQuest }
    ]);
}

function findMagicHerbs() {
    if (!gameState.inventory.includes('Enchanted Herbs')) {
        gameState.inventory.push('Enchanted Herbs'); // Add new item to inventory
        gameState.sideQuestsCompleted++; // Track side quest completion
        updateInventory(); // Refresh inventory display
        updateStory(
            "You discover glowing Enchanted Herbs with potent healing powers. Perhaps the Mice Bakers would trade these for something useful on your journey.",
            "assets/enchanted_herbs.jpg"
        );
    } else {
        updateStory(
            "You have already gathered the Enchanted Herbs. They will aid you later in your journey.",
            "assets/forest_path.jpg"
        );
    }
    updateChoices([
        { text: 'Return to the Luminescent Grove', action: elvesQuest }
    ]);
}

// Quest 2: Rekindle the Flame of Energy from the Dragon Wizards
function dragonsQuest() {
    updateStory(
        "You reach the Dragon Sanctum, a sacred place where young dragons are trained in the ways of Paladin Wizards. The flame that powers all magic in Luméira is fading. The Dragon Wizards call upon you to rekindle it and restore the flow of energy.",
        "assets/dragon_sanctum.jpg"
    );
    updateChoices([
        { text: 'Approach the Flame', action: approachFlame }
    ]);
}

function approachFlame() {
    updateStory(
        "As you step closer to the dim flame, you sense the ancient power surrounding it. Elder Zaraphon, the leader of the Dragon Wizards, approaches and speaks solemnly, 'This flame holds the heart of Luméira’s magic. Only those who prove their worth may rekindle it.'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Pledge your loyalty to Luméira', action: pledgeLoyalty },
        { text: 'Seek to understand the source of the flame’s fading', action: investigateFlame },
        { text: 'Request guidance from the Dragon Wizards', action: requestGuidance }
    ]);
}

function pledgeLoyalty() {
    updateStory(
        "You kneel before Elder Zaraphon and pledge your unwavering loyalty to Luméira. He nods approvingly. 'Then may your heart burn as brightly as this flame,' he says. 'But remember, loyalty alone is not enough to rekindle this ancient power.'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Ask how you can rekindle the flame', action: rekindleProcess },
        { text: 'Express your understanding of the flame’s burden', action: expressUnderstanding }
    ]);
}

function investigateFlame() {
    updateStory(
        "You inspect the flame, noticing faint, dark wisps rising from it. A young Dragon Wizard explains, 'It has been growing weaker due to an imbalance in Luméira. Only a true Paladin Wizard can rekindle it, but wisdom and caution are required.'",
        "assets/dragon_wizard.jpg"
    );
    updateChoices([
        { text: 'Ask the Dragon Wizards for advice', action: requestGuidance },
        { text: 'Pledge your loyalty to Luméira', action: pledgeLoyalty },
        { text: 'Attempt to rekindle the flame yourself', action: rekindleAttempt }
    ]);
}

function requestGuidance() {
    updateStory(
        "Elder Zaraphon speaks: 'The flame requires the balance of both strength and compassion. Reflect on your journey, Paladin Wizard. What drives your desire to rekindle it?'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'The responsibility to protect Luméira', action: responsibility },
        { text: 'The hope of empowering future generations', action: empowerFuture },
        { text: 'To gain the Dragon Wizards’ respect and knowledge', action: gainRespect }
    ]);
}

function responsibility() {
    updateStory(
        "'A noble purpose,' Zaraphon says. 'But remember, even noble hearts can falter if they bear too much.' He gestures to the flame, inviting you to try.",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Rekindle the Flame of Energy', action: flameOfEnergy }
    ]);
}

function empowerFuture() {
    updateStory(
        "'Hope is a powerful force,' Zaraphon agrees, 'but hope alone must be tempered with patience and wisdom.' He gestures towards the flame. 'You may now attempt to rekindle it.'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Rekindle the Flame of Energy', action: flameOfEnergy }
    ]);
}

function gainRespect() {
    updateStory(
        "Zaraphon frowns slightly, sensing your ambition. 'Respect is earned, not taken, young Paladin. Prove yourself with humility.' The flame flickers, as if testing your resolve.",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Reflect on your motivation', action: responsibility },
        { text: 'Proceed to rekindle the flame', action: flameOfEnergy }
    ]);
}

function rekindleAttempt() {
    updateStory(
        "You reach out to rekindle the flame, feeling its immense energy resist you. Zaraphon places a hand on your shoulder. 'Patience, Paladin. The flame demands more than sheer willpower.'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Ask for guidance', action: requestGuidance },
        { text: 'Reaffirm your purpose', action: responsibility }
    ]);
}

function rekindleProcess() {
    updateStory(
        "Elder Zaraphon nods solemnly. 'To rekindle the flame, you must offer it a part of your spirit. But beware, for only those who are pure of heart can withstand the trial.'",
        "assets/elder_zaraphon.jpg"
    );
    updateChoices([
        { text: 'Rekindle the Flame of Energy', action: flameOfEnergy },
        { text: 'Step back and reflect', action: responsibility }
    ]);
}

function flameOfEnergy() {
    if (!gameState.inventory.includes('Flame of Energy')) {
        gameState.inventory.push('Flame of Energy'); // Add item to inventory
        gameState.questsCompleted++; // Track the quest completion
        updateInventory(); // Refresh inventory display
        updateStory(
            "The flame roars back to life, filling the sanctum with warmth. The Dragon Wizards offer you an Enchanted Shield as thanks for your bravery. 'Use this wisely, Paladin Wizard,' they say. In the distance, you see young dragons practicing their magical skills—future Paladin Wizards like yourself.",
            "assets/flame_of_energy.jpg"
        );
        gameState.inventory.push('Enchanted Shield'); // Add new item to inventory
        updateInventory(); // Refresh inventory display
        offerNextQuest(); // Continue to the next quest
    } else {
        updateStory(
            "You have already rekindled the Flame of Energy, Paladin Wizard. The Dragon Wizards nod in approval, reminding you of the importance of balance in your quest.",
            "assets/dragon_sanctum.jpg"
        );
    }
    offerNextQuest(); // Continue to the next quest
}


// Quest 3: Retrieve the Loaf of Friendship from the Mice Bakers
function miceQuest() {
    updateStory(
        "You visit the Crumbly Hearth, home of the Mice Bakers. Pippin, the leader, offers you the magical Loaf of Friendship in exchange for the Enchanted Herbs.",
        "assets/mice_bakers.jpg"
    );
    updateChoices([
        { text: 'Trade the Enchanted Herbs for the Loaf of Friendship', action: tradeHerbsForBread },
        { text: 'Refuse the trade and leave the bakery', action: leaveBakery }
    ]);
}

function tradeHerbsForBread() {
    if (gameState.inventory.includes('Enchanted Herbs')) {
        gameState.inventory = gameState.inventory.filter(item => item !== 'Enchanted Herbs'); // Remove herbs
        gameState.inventory.push('Loaf of Friendship'); // Add loaf to inventory
        gameState.questsCompleted++; // Track quest completion
        updateInventory(); // Refresh inventory display
        updateStory(
            "You trade the Enchanted Herbs for the Loaf of Friendship. The Mice Bakers thank you, 'This bread will aid you in uniting the people of Luméira.'",
            "assets/loaf_of_friendship.jpg"
        );
        checkQuests(); // Check if all quests are completed
    } else {
        updateStory(
            "You don't have the Enchanted Herbs needed for the trade. Pippin frowns, 'Come back when you have something to offer.'",
            "assets/mice_bakers.jpg"
        );
        updateChoices([
            { text: 'Return to the Luminescent Grove', action: elvesQuest }
        ]);
    }
}

function leaveBakery() {
    updateStory(
        "You decide to leave the bakery without trading. The Mice Bakers watch as you exit, their gaze lingering on the empty basket.",
        "assets/mice_bakers.jpg"
    );
    updateChoices([
        { text: 'Return to the Luminescent Grove', action: elvesQuest }
    ]);
}

// Check if all main quests are completed and either unlock hidden quest or move forward
function checkQuests() {
    if (gameState.questsCompleted === 3 && !gameState.hiddenQuestUnlocked) {
        if (gameState.karmaLevel === 0) {
            unlockHiddenQuest(); // Unlock the hidden Soul Gem quest
        } else {
            goToCastleTower(); // Go directly to the final tower quest
        }
    } else if (gameState.questsCompleted === 3) {
        goToCastleTower(); // Proceed to the final tower quest
    }
}

// Hidden Quest: Unlock the Soul Gem if Karma is balanced
function unlockHiddenQuest() {
    gameState.hiddenQuestUnlocked = true;
    updateStory(
        "By balancing both light and darkness, you have unlocked the path to the legendary Soul Gem. It holds the key to perfect harmony in Luméira.",
        "assets/soul_gem_hint.jpg"
    );
    updateChoices([
        { text: 'Seek the Soul Gem', action: soulGemQuest },
        { text: 'Ignore the whispers and continue to the tower', action: goToCastleTower }
    ]);
}

function soulGemQuest() {
    updateStory(
        "You discover the hidden Soul Gem, a powerful artifact containing the energies of both light and dark. Its power can restore balance to Luméira, but at a great cost.",
        "assets/soul_gem.jpg"
    );
    updateChoices([
        { text: 'Take the Soul Gem', action: collectSoulGem }
    ]);
}

function collectSoulGem() {
    gameState.inventory.push('Soul Gem'); // Add Soul Gem to inventory
    updateInventory(); // Refresh inventory display
    updateStory(
        "You take the Soul Gem. Its energy flows through you, granting you the power to restore balance across Luméira. This gem will greatly influence the outcome of your journey.",
        "assets/soul_gem_collected.jpg"
    );
    goToCastleTower(); // Proceed to the final tower quest
}

// Quest 4: Ascend the Castle Tower and Meet the Wizard
function goToCastleTower() {
    updateStory(
        "With the Jewels of Karma, the Flame of Energy, and the Loaf of Friendship in your possession, you ascend the Castle Tower. The door at the top is locked, but there must be a way to open it.",
        "assets/castle_tower.jpg"
    );
    updateChoices([
        { text: 'Search for a key', action: towerSideQuest }
    ]);
}

// Tower Side Quest: Find the Key to Enter the Wizard's Chamber
function towerSideQuest() {
    updateStory(
        "As you explore the tower, you find an ancient key hidden behind a statue. This must be the key to open the Wizard's chamber.",
        "assets/key.jpg"
    );
    gameState.inventory.push('Ancient Key'); // Add the key to the inventory
    updateInventory(); // Refresh inventory display
    updateChoices([
        { text: 'Use the key to open the door', action: useKey },
        { text: 'Return to the Elves Quest', action: elvesQuest }
    ]);
}

function useKey() {
    if (gameState.inventory.includes('Ancient Key') && gameState.inventory.includes('Loaf of Friendship')) {
        gameState.inventory = gameState.inventory.filter(item => item !== 'Ancient Key'); // Remove key after use
        updateInventory(); // Refresh inventory display
        updateStory(
            "You use the ancient key to unlock the door. It creaks open, revealing the Wizard of Luméira standing at the top of the tower, waiting for you.",
            "assets/wizard.jpg"
        );
        meetTheWizard(); // Proceed to the wizard encounter
    } else if (gameState.inventory.includes('Ancient Key') && !gameState.inventory.includes('Loaf of Friendship')) {
        updateStory(
            "You hold the ancient key in your hand, but the door remains unyielding. A faint inscription appears on the door: 'Only those who carry the Loaf of Friendship may enter.' It seems you must find this mysterious loaf before proceeding.",
            "assets/locked_door.jpg"
        );
        updateChoices([
            { text: 'Return to the Elves Quest', action: elvesQuest }
        ]);
    } else {
        updateStory(
            "You don't have the key to open the door. Search the tower again for the key.",
            "assets/castle_tower.jpg"
        );
        updateChoices([
            { text: 'Return to the Elves Quest', action: elvesQuest }
        ]);
    }
}


// Meeting the Wizard at the top of the tower
function meetTheWizard() {
    let storyText = "At the top of the tower, the ancient Wizard of Luméira greets you. His eyes glow with wisdom as he gazes upon the items you carry. 'You have come far, Paladin Wizard,' he says.";
    
    // Branch the story based on the player's karma level
    if (gameState.karmaLevel > 0) {
        storyText += " 'You have chosen the path of light. The balance of positive karma will bring peace and harmony to Luméira.'";
    } else if (gameState.karmaLevel < 0) {
        storyText += " 'You have walked the dark path, but even negative karma has a role to play in balancing the world. Luméira will be stronger for the trials you have faced.'";
    } else if (gameState.karmaLevel === 0) {
        storyText += " 'You have found perfect balance between light and dark. Yours is the truest path, for harmony cannot exist without both sides of the karmic scale.'";
    }

    // Special dialogue if the player has the Soul Gem
    if (gameState.inventory.includes('Soul Gem')) {
        storyText += " The **Soul Gem** you carry glows with incredible energy, representing your mastery over both positive and negative karma. The Wizard smiles. 'With the Soul Gem, you hold the ultimate key to restoring true balance to Luméira.'";
    }

    storyText += " 'Now, Paladin Wizard, the final choice is yours. How will you use your karmic energy to restore balance to Luméira?'";

    updateStory(storyText, "assets/wizard.jpg");

    // Final choices for the player based on their journey
    updateChoices([
        { text: 'Use the Soul Gem to restore balance', action: finalEndingSoulGem },
        { text: 'Use your karmic energy to restore balance', action: finalEndingKarma }
    ]);
}

// Final ending if the player uses the Soul Gem
function finalEndingSoulGem() {
    updateStory(
        "You raise the **Soul Gem**, and its energy flows through you, casting light and shadow across the land. The Wizard smiles as the gem releases its power, spreading balance throughout Luméira. The dark forces that once threatened the land dissipate, and harmony is restored.",
        "assets/soul_gem_end.jpg"
    );
    updateChoices([
        { text: 'Thank the Wizard and leave the tower', action: endGame }
    ]);
}

// Final ending based on the player's karma
function finalEndingKarma() {
    if (gameState.karmaLevel > 0) {
        updateStory(
            "Using the strength of your positive karma, you join the Wizard in casting a spell of pure light. The energies of the land are restored, and the people of Luméira rejoice in the peace you have brought. You have used your power for good, and the land flourishes under the light.",
            "assets/positive_karma_end.jpg"
        );
    } else if (gameState.karmaLevel < 0) {
        updateStory(
            "Drawing upon your negative karma, you and the Wizard channel a powerful, dark energy that stabilizes the forces of Luméira. Though the light has faded, balance has been achieved. The land is shadowed, but stronger because of your choices.",
            "assets/negative_karma_end.jpg"
        );
    } else {
        updateStory(
            "With your perfectly balanced karma, you and the Wizard work in harmony to restore the energies of Luméira. The world glows with perfect equilibrium, and the people feel a deep connection to the flow of life and magic. You have achieved true balance and restored harmony to the realm.",
            "assets/balanced_karma_end.jpg"
        );
    }

    updateChoices([
        { text: 'Thank the Wizard and leave the tower', action: endGame }
    ]);
}

// End of the game
function endGame() {
    updateStory(
        "Your journey has come to an end. You leave the tower, looking out across the restored lands of Luméira. The balance of energy has been restored, thanks to your efforts. As you walk into the horizon, the sun and moon hang in perfect harmony in the sky—a reminder of the balance between light and darkness. The people of Luméira will forever remember the Paladin Wizard who brought balance to their world.",
        "assets/end.jpg"
    );
    updateChoices([
        { text: 'Restart the adventure', action: returnToHome }
    ]);
}

// Offer the next quest based on the number of completed quests
function offerNextQuest() {
    if (gameState.questsCompleted === 1) {
        updateStory(
            "With the Jewels of Karma in your possession, you continue your journey. The Dragon Wizards have called upon you to rekindle the **Flame of Energy**, which powers all magic in Luméira.",
            "assets/dragon_sanctum.jpg"
        );
        updateChoices([
            { text: 'Travel to the Dragon Sanctum', action: dragonsQuest }
        ]);
    } else if (gameState.questsCompleted === 2) {
        updateStory(
            "With the Flame of Energy burning bright once more, you now journey to the Crumbly Hearth to receive the **Loaf of Friendship** from the Mice Bakers, who will aid you in uniting the people of Luméira.",
            "assets/mice_bakers.jpg"
        );
        updateChoices([
            { text: 'Travel to the Crumbly Hearth', action: miceQuest }
        ]);
    }
}

// Start game and return home buttons
startButton.onclick = startGame;
returnHomeButton.onclick = returnToHome;
