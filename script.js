class Card {
    constructor(value, name, suit) {
        this.value = value;
        this.name = name;
        this.suit = suit;
    }
}

class Deck {
    constructor() {
        this.names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
        this.cards = [];

        for (let suit of this.suits) {
            for (let i = 0; i < this.names.length; i++) {
                this.cards.push(new Card(i + 2, this.names[i], suit));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let stackAmount = 9;
    let startGrid;
    let drawDeck;
    let myDeck;
    let activeIndex = null;

    const stackAmountSlider = document.getElementById('stack-amount');
    const stackAmountValue = document.getElementById('stack-amount-value');
    const startGameButton = document.getElementById('start-game');
    const rulesButton = document.getElementById('rules-button');
    const titleScreen = document.getElementById('title-screen');
    const gameArea = document.getElementById('game-area');
    const cardContainer = document.getElementById('card-container');
    const rulesScreen = document.getElementById('rules-screen');
    const backToTitleButton = document.getElementById('back-to-title');
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.id = 'play-again';  // Add an ID for styling and access
    playAgainButton.style.display = 'none'; // Initially hidden

      // --- Audio Setup ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); //For compatability
    let dealSound, correctSound, incorrectSound, winSound, loseSound, clickSound, hoverSound; // Add hoverSound

    // Helper function to load audio files
      function loadSound(url, callback) {
        fetch(url) //Modern way to load
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                callback(decodedAudio);
            })
            .catch(error => console.error("Error loading sound:", error));
    }

    // Load all the sounds
    loadSound('sounds/deal.wav', function(buffer) { dealSound = buffer; });
    loadSound('sounds/correct.wav', function(buffer) { correctSound = buffer; });
    loadSound('sounds/incorrect.wav', function(buffer) { incorrectSound = buffer; });
    loadSound('sounds/win.wav', function(buffer) { winSound = buffer; });
    loadSound('sounds/lose.wav', function(buffer) { loseSound = buffer; });
    loadSound('sounds/click.wav', function(buffer) { clickSound = buffer; });
    loadSound('sounds/hover.wav', function(buffer) { hoverSound = buffer; }); // Load hover sound


    // Helper function to play sounds using Web Audio API.
    function playSound(buffer) {
        if (!buffer) return; // Don't play if not loaded yet
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0); // Play immediately
    }

    function updateDrawPileCount() {
        document.getElementById('draw-count').textContent = drawDeck.length;
    }

    function dealCard() {
        return drawDeck.length > 0 ? drawDeck.shift() : null;
    }

    function updateGrid() {
        let columns = Math.min(stackAmount, 3);
        let rows = Math.ceil(stackAmount / columns);
        cardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        cardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    }

    function startGame() {
        // Hide title screen and potentially other screens
        titleScreen.style.display = 'none';
        rulesScreen.style.display = 'none';
        gameArea.style.display = 'block';
        playAgainButton.style.display = 'none'; //Hide play again

        myDeck = new Deck();
        myDeck.shuffle();
        startGrid = myDeck.cards.slice(0, stackAmount);
        drawDeck = myDeck.cards.slice(stackAmount);

        updateDrawPileCount();
        createCards();
        updateGrid();
        //Append to body when the game has started.
        document.body.appendChild(playAgainButton);
        playSound(dealSound); // Play deal sound on game start
    }

  function createCards() {
    cardContainer.innerHTML = '';
    activeIndex = null;

    for (let i = 0; i < startGrid.length; i++) {
        const card = startGrid[i];
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.index = i;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = card.name;

        const suitDiv = document.createElement('div');
        suitDiv.className = `suit ${card.suit.toLowerCase()}`;
        suitDiv.textContent = getSuitSymbol(card.suit);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        const higherButton = document.createElement('button');
        higherButton.className = 'higher';
        higherButton.textContent = 'Higher';
        higherButton.addEventListener('click', () => {
            if (div.classList.contains('active')) {
                bet('higher', i);
            }
        });

        const lowerButton = document.createElement('button');
        lowerButton.className = 'lower';
        lowerButton.textContent = 'Lower';
        lowerButton.addEventListener('click', () => {
            if (div.classList.contains('active')) {
                bet('lower', i);
            }
        });


        buttonsDiv.appendChild(higherButton);
        buttonsDiv.appendChild(lowerButton);
        buttonsDiv.style.display = "none"; // Initially hide

        div.appendChild(valueDiv);
        div.appendChild(suitDiv);
        div.appendChild(buttonsDiv);

        // Add mouseover and mouseout event listeners
        div.addEventListener('mouseover', () => {
          if (!div.classList.contains('flipped')) {
            playSound(hoverSound);
          }
        });


        div.addEventListener('click', () => {
          const cards = document.querySelectorAll('.card');
            if (!div.classList.contains('flipped')) {
                // Hide buttons and remove 'active' from ALL cards
                cards.forEach(c => {
                    c.classList.remove('active');
                    c.querySelector('.buttons').style.display = 'none';
                });

                // Show buttons and set 'active' on the CLICKED card
                div.classList.add('active');
                buttonsDiv.style.display = 'flex'; // Show buttons
                activeIndex = i;
            }
        });

        cardContainer.appendChild(div);
    }
}
    function getSuitSymbol(suit) {
        switch (suit) {
            case 'Diamonds': return '♦';
            case 'Spades':  return '♠';
            case 'Clubs':   return '♣';
            case 'Hearts':  return '♥';
            default:        return '';
        }
    }

    function showNotification(message) {
        const notificationArea = document.getElementById('notification-area');
        notificationArea.innerHTML += `<div class="notification">${message}</div>`;

        setTimeout(() => {
            if (notificationArea.firstChild) {
                notificationArea.removeChild(notificationArea.firstChild);
            }
        }, 3000);
    }

    function bet(choice, selectedIndex) {
      if (activeIndex === null) {
          showNotification("Please select a card stack first.");
          return;
      }
      const cardContainer = document.getElementById('card-container');
        if (cardContainer.children[selectedIndex].classList.contains('flipped')) {
            showNotification("This stack is flipped. Choose another.");
            return;
        }

        const selectedCard = startGrid[selectedIndex];
        const nextCard = dealCard();

        if (!nextCard) {
            checkGameOver();
            return;
        }

        showNotification(`Next card: ${nextCard.name} of ${nextCard.suit}.`);

        const betIsCorrect = (choice === 'higher' && nextCard.value > selectedCard.value) ||
                            (choice === 'lower' && nextCard.value < selectedCard.value);

        if (betIsCorrect) {
            showNotification(`Correct!`);
            playSound(correctSound); // Play correct sound
            replaceCard(selectedIndex, nextCard);
        } else {
            showNotification(`Incorrect! This stack is now flipped.`);
            playSound(incorrectSound); // Play incorrect sound
            flipStack(selectedIndex);
        }

        updateDrawPileCount();
        checkGameOver();
    }

    function replaceCard(index, newCard) {
      const cardContainer = document.getElementById('card-container');
        const cardDiv = cardContainer.children[index];
        if (!cardDiv) return;

        // Update card content directly
        cardDiv.querySelector('.value').textContent = newCard.name;
        cardDiv.querySelector('.suit').className = `suit ${newCard.suit.toLowerCase()}`;
        cardDiv.querySelector('.suit').textContent = getSuitSymbol(newCard.suit);

        // Update game state.  Do NOT touch active class or buttons here.
        startGrid[index] = newCard;
    }

    function flipStack(index) {
        const cardContainer = document.getElementById('card-container');
        const cardDiv = cardContainer.children[index]; // Use children
        if (cardDiv) {
          cardDiv.classList.add('flipped');
          cardDiv.classList.remove('active');
          cardDiv.querySelector('.buttons').style.display = 'none'; //Hide buttons
          activeIndex = null;
        }

    }

    function checkGameOver() {
        const cardContainer = document.getElementById('card-container');
        const allFlipped = Array.from(cardContainer.children).every(card => card.classList.contains('flipped'));

        if (drawDeck.length === 0) {
            showNotification("Game over! No more cards");
             playSound(winSound); // Play win sound
            playAgainButton.style.display = 'block';
        }

        if (allFlipped) {
            showNotification("Game over! All stacks flipped.");
            playSound(loseSound); // Play lose sound
            playAgainButton.style.display = 'block'; // Show play again button
        }
    }

     // --- Event Listeners ---
    stackAmountValue.textContent = stackAmount;
    updateGrid();

    stackAmountSlider.addEventListener('input', () => {
        stackAmount = parseInt(stackAmountSlider.value);
        stackAmountValue.textContent = stackAmount;
        updateGrid();
    });

    startGameButton.addEventListener('click', () => {
        playSound(clickSound); // Button click sound
        titleScreen.style.display = 'none';
        rulesScreen.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    });

    rulesButton.addEventListener('click', () => {
        playSound(clickSound);
        titleScreen.style.display = 'none';
        gameArea.style.display = 'none';
        rulesScreen.style.display = 'block';
    });

    backToTitleButton.addEventListener('click', () => {
        playSound(clickSound);
        rulesScreen.style.display = 'none';
        titleScreen.style.display = 'flex';
    });

    //Play Again Button
    playAgainButton.addEventListener('click', () => {
        playSound(clickSound);
        playAgainButton.style.display = 'none'; // Hide play again button
        gameArea.style.display = 'block'; // Show the game area
        startGame();                     // Restart the game
    });
});