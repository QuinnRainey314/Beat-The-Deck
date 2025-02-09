var stackAmount = 3;
let startGrid;
let drawDeck;
let myDeck;

function card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}

function deck() {
    this.names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    var cards = [];

    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            cards.push(new card(n + 2, this.names[n], this.suits[s]));
        }
    }

    return cards;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

document.addEventListener('DOMContentLoaded', function() {
    const stackAmountSlider = document.getElementById('stack-amount');
    const stackAmountValue = document.getElementById('stack-amount-value');
    const startGameButton = document.getElementById('start-game');
    const titleScreen = document.getElementById('title-screen');
    const gameArea = document.getElementById('game-area');

    stackAmountSlider.addEventListener('input', function() {
        stackAmount = parseInt(this.value);
        stackAmountValue.textContent = stackAmount;
    });

    startGameButton.addEventListener('click', function() {
        titleScreen.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    });
});

function startGame() {
    myDeck = new deck();
    myDeck = shuffle(myDeck);

    startGrid = myDeck.slice(0, 9);
    drawDeck = myDeck.slice(9, 52);

    updateDrawPileCount();
    createCards();
}

function updateDrawPileCount() {
    document.getElementById('draw-count').textContent = drawDeck.length;
}

function createCards() {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    cardContainer.style.setProperty('--stack-amount', stackAmount);

    // Force reflow to update grid layout
    cardContainer.offsetWidth;

    for (let i = 0; i < startGrid.length; i++) {
        const div = document.createElement('div');
        div.className = 'card';
        div.setAttribute('data-index', i);

        const card = startGrid[i];

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = card.name;

        const suitDiv = document.createElement('div');
        suitDiv.className = 'suit ' + card.suit.toLowerCase();
        let ascii_char;
        switch (card.suit) {
            case 'Diamonds': ascii_char = '♦'; break;
            case 'Spades': ascii_char = '♠'; break;
            case 'Clubs': ascii_char = '♣'; break;
            case 'Hearts': ascii_char = '♥'; break;
        }
        suitDiv.textContent = ascii_char;

        div.appendChild(valueDiv);
        div.appendChild(suitDiv);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        const higherButton = document.createElement('button');
        higherButton.className = 'higher';
        higherButton.textContent = 'Higher';
        higherButton.addEventListener('click', function () {
            bet('higher', i);
        });

        const lowerButton = document.createElement('button');
        lowerButton.className = 'lower';
        lowerButton.textContent = 'Lower';
        lowerButton.addEventListener('click', function () {
            bet('lower', i);
        });

        buttonsDiv.appendChild(higherButton);
        buttonsDiv.appendChild(lowerButton);

        div.appendChild(buttonsDiv);

        div.addEventListener('click', function () {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => card.classList.remove('active'));
            div.classList.add('active');
        });

        cardContainer.appendChild(div);
    }
}

function showNotification(message) {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationArea.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function bet(choice, selectedIndex) {
    const cardContainer = document.getElementById('card-container');
    const selectedCard = startGrid[selectedIndex];

    if (cardContainer.children[selectedIndex].classList.contains('flipped')) {
        showNotification("This stack is flipped. Choose another.");
        return;
    }

    showNotification(`You chose ${choice} for card ${selectedCard.name} of ${selectedCard.suit}.`);

    if (drawDeck.length === 0) {
        showNotification("Game over! No more cards left.");
        return;
    }

    const nextCard = drawDeck.shift();
    showNotification(`Next card: ${nextCard.name} of ${nextCard.suit}.`);

    let betResult = false;
    if (choice === 'higher' && nextCard.value > selectedCard.value) {
        betResult = true;
    } else if (choice === 'lower' && nextCard.value < selectedCard.value) {
        betResult = true;
    }

    if (betResult) {
        showNotification(`Correct! The next card is ${nextCard.name} of ${nextCard.suit}.`);
        replaceCard(selectedIndex, nextCard);
    } else {
        showNotification(`Incorrect! The next card is ${nextCard.name} of ${nextCard.suit}. This stack is now flipped.`);
        flipStack(selectedIndex);
    }

    updateDrawPileCount();
    checkGameOver();
}

function replaceCard(index, newCard) {
    const cardContainer = document.getElementById('card-container');
    const cardDiv = cardContainer.children[index];

    let ascii_char;
    switch (newCard.suit) {
        case 'Diamonds': ascii_char = '♦'; break;
        case 'Spades': ascii_char = '♠'; break;
        case 'Clubs': ascii_char = '♣'; break;
        case 'Hearts': ascii_char = '♥'; break;
    }

    cardDiv.innerHTML = '';

    const valueDiv = document.createElement('div');
    valueDiv.className = 'value';
    valueDiv.textContent = newCard.name;

    const suitDiv = document.createElement('div');
    suitDiv.className = 'suit ' + newCard.suit.toLowerCase();
    suitDiv.textContent = ascii_char;

    cardDiv.appendChild(valueDiv);
    cardDiv.appendChild(suitDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const higherButton = document.createElement('button');
    higherButton.className = 'higher';
    higherButton.textContent = 'Higher';
    higherButton.addEventListener('click', function () {
        bet('higher', index);
    });

    const lowerButton = document.createElement('button');
    lowerButton.className = 'lower';
    lowerButton.textContent = 'Lower';
    lowerButton.addEventListener('click', function () {
        bet('lower', index);
    });

    buttonsDiv.appendChild(higherButton);
    buttonsDiv.appendChild(lowerButton);

    cardDiv.appendChild(buttonsDiv);

    startGrid[index] = newCard;
}

function flipStack(index) {
    const cardContainer = document.getElementById('card-container');
    const cardDiv = cardContainer.children[index];
    cardDiv.classList.add('flipped');
    cardDiv.querySelector('.buttons').style.display = 'none';
}

function checkGameOver() {
    if (drawDeck.length === 0) {
        showNotification("Game over! No more cards to play.");
    }
}