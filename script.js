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
    let timerInterval;
    let seconds = 0;
    let isMuted = false;
    let currentPlayer = null;

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
    playAgainButton.id = 'play-again';
    playAgainButton.style.display = 'none';
    const muteButton = document.createElement('button');
    muteButton.id = 'mute-button';
    muteButton.innerHTML = getMuteIcon(isMuted);
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.textContent = 'Time: 0s';
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let dealSound, correctSound, incorrectSound, winSound, loseSound, clickSound, hoverSound;

    function loadSound(url, callback) {
        fetch(url)
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

    loadSound('sounds/deal.wav', function(buffer) { dealSound = buffer; });
    loadSound('sounds/correct.wav', function(buffer) { correctSound = buffer; });
    loadSound('sounds/incorrect.wav', function(buffer) { incorrectSound = buffer; });
    loadSound('sounds/win.wav', function(buffer) { winSound = buffer; });
    loadSound('sounds/lose.wav', function(buffer) { loseSound = buffer; });
    loadSound('sounds/click.wav', function(buffer) { clickSound = buffer; });
    loadSound('sounds/hover.wav', function(buffer) { hoverSound = buffer; });

    function playSound(buffer) {
        if (!buffer || isMuted) return;
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
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
        titleScreen.style.display = 'none';
        rulesScreen.style.display = 'none';
        gameArea.style.display = 'block';
        playAgainButton.style.display = 'none';

        myDeck = new Deck();
        myDeck.shuffle();
        startGrid = myDeck.cards.slice(0, stackAmount);
        drawDeck = myDeck.cards.slice(stackAmount);

        updateDrawPileCount();
        createCards();
        updateGrid();
        document.body.appendChild(playAgainButton);
        playSound(dealSound);

        seconds = 0;
        timerDisplay.textContent = 'Time: 0s';
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Time: ${seconds}s`;
        }, 1000);
         if (!document.getElementById('timer-display')) {
                gameArea.appendChild(timerDisplay);
         }
        if(!document.getElementById('mute-button')){
            gameArea.appendChild(muteButton);
        }
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
        buttonsDiv.style.display = "none";

        div.appendChild(valueDiv);
        div.appendChild(suitDiv);
        div.appendChild(buttonsDiv);

        div.addEventListener('mouseover', () => {
          if (!div.classList.contains('flipped')) {
            playSound(hoverSound);
          }
        });


        div.addEventListener('click', () => {
          const cards = document.querySelectorAll('.card');
            if (!div.classList.contains('flipped')) {
                cards.forEach(c => {
                    c.classList.remove('active');
                    c.querySelector('.buttons').style.display = 'none';
                });

                div.classList.add('active');
                buttonsDiv.style.display = 'flex';
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
            playSound(correctSound);
            replaceCard(selectedIndex, nextCard);
        } else {
            showNotification(`Incorrect! This stack is now flipped.`);
            playSound(incorrectSound);
            flipStack(selectedIndex);
        }

        updateDrawPileCount();
        checkGameOver();
    }

    function replaceCard(index, newCard) {
      const cardContainer = document.getElementById('card-container');
        const cardDiv = cardContainer.children[index];
        if (!cardDiv) return;

        cardDiv.querySelector('.value').textContent = newCard.name;
        cardDiv.querySelector('.suit').className = `suit ${newCard.suit.toLowerCase()}`;
        cardDiv.querySelector('.suit').textContent = getSuitSymbol(newCard.suit);

        startGrid[index] = newCard;
    }

    function flipStack(index) {
        const cardContainer = document.getElementById('card-container');
        const cardDiv = cardContainer.children[index];
        if (cardDiv) {
          cardDiv.classList.add('flipped');
          cardDiv.classList.remove('active');
          cardDiv.querySelector('.buttons').style.display = 'none';
          activeIndex = null;
        }

    }
    function updateProfile(wins, losses) {
    if (currentPlayer) {
        currentPlayer.wins += wins;
        currentPlayer.losses += losses;
        if (wins > 0 && seconds < currentPlayer.highScore) {
            currentPlayer.highScore = seconds;
        }
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer)); // Save updated data
    }
}
    function checkGameOver() {
        const cardContainer = document.getElementById('card-container');
        const allFlipped = Array.from(cardContainer.children).every(card => card.classList.contains('flipped'));

        if (drawDeck.length === 0) {
            showNotification("Game over! No more cards");
             playSound(winSound);
            playAgainButton.style.display = 'block';
            clearInterval(timerInterval);
            updateProfile(1,0);
        }

        if (allFlipped) {
            showNotification("Game over! All stacks flipped.");
            playSound(loseSound);
            playAgainButton.style.display = 'block';
            clearInterval(timerInterval);
            updateProfile(0,1);
        }
    }

    function getMuteIcon(isMuted) {
        return isMuted
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }

    function createProfile() {
        const playerNameInput = document.getElementById('player-name');
        const playerName = playerNameInput.value.trim();

        if (playerName) {
            currentPlayer = {
                name: playerName,
                highScore: Infinity,
                wins: 0,
                losses: 0
            };
            localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
            document.getElementById('profile-creation').style.display = 'none';
            displayProfile(); // Show the profile info
            document.getElementById('start-game').style.display = 'inline-block';
            document.getElementById('rules-button').style.display = 'inline-block';
            document.getElementById('delete-profile').style.display = 'inline-block';

        } else {
            showNotification('Please enter a valid name.');
        }
    }
    function loadProfile() {
        const storedProfile = localStorage.getItem('currentPlayer');
        if (storedProfile) {
            currentPlayer = JSON.parse(storedProfile);
             document.getElementById('profile-creation').style.display = 'none';
             displayProfile();
           document.getElementById('start-game').style.display = 'inline-block';
            document.getElementById('rules-button').style.display = 'inline-block';
            document.getElementById('delete-profile').style.display = 'inline-block';

        } else{
            document.getElementById('profile-creation').style.display = 'block';
            document.getElementById('start-game').style.display = 'none';
            document.getElementById('rules-button').style.display = 'none';
            document.getElementById('delete-profile').style.display = 'none';
        }
    }
    function deleteProfile(){
        localStorage.removeItem('currentPlayer');
        currentPlayer = null;
        document.getElementById('profile-display').innerHTML = '';
        document.getElementById('profile-creation').style.display = 'block';
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('rules-button').style.display = 'none';
        document.getElementById('delete-profile').style.display = 'none';


    }
    function displayProfile() {
    const profileDisplay = document.getElementById('profile-display');
        if (currentPlayer) {
            profileDisplay.innerHTML = `
                <p>Player: ${currentPlayer.name}</p>
                <p>Best Time: ${currentPlayer.highScore === Infinity ? 'N/A' : currentPlayer.highScore + 's'}</p>
                <p>Wins: ${currentPlayer.wins}</p>
                <p>Losses: ${currentPlayer.losses}</p>
            `;
        }
    }

     // --- Event Listeners ---
    stackAmountValue.textContent = stackAmount;
    updateGrid();
    loadProfile(); // Load the profile when the page loads

    stackAmountSlider.addEventListener('input', () => {
        stackAmount = parseInt(stackAmountSlider.value);
        stackAmountValue.textContent = stackAmount;
        updateGrid();
    });

    startGameButton.addEventListener('click', () => {
        playSound(clickSound);
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

    playAgainButton.addEventListener('click', () => {
        playSound(clickSound);
        playAgainButton.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    });

    muteButton.addEventListener('click', () => {
      isMuted = !isMuted;
      muteButton.innerHTML = getMuteIcon(isMuted);
    });

    document.getElementById('create-profile').addEventListener('click', createProfile);
    document.getElementById('delete-profile').addEventListener('click', deleteProfile);

});