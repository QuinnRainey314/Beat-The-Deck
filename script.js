var cardAmount = 9;

function card(value, name, suit){
    this.value = value;
    this.name = name;
    this.suit = suit;
}

function deck(){
    this.names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', "Q", "K", "A"]
    this.suits = ['Hearts','Diamonds','Spades','Clubs'];
    var cards = [];

    for(var s = 0; s < this.suits.length; s++) {
        for(var n = 0; n < this.names.length; n++) {
            cards.push(new card(n+1, this.names[n], this.suits[s]));
        }
    }

    return cards;
}

function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] =x);
    return o;
};

var myDeck = new deck();
myDeck = shuffle(myDeck);

const startGrid = myDeck.slice(0, cardAmount);


window.onload = function() {
    const cardContainer = document.getElementById('card-container');

    for(var i=0; i < startGrid.length; i++){
        div = document.createElement('div');
        div.className = 'card';

        if (startGrid[i].suit == 'Diamonds'){
            var ascii_char = '♦'
        } else if (startGrid[i].suit == 'Spades'){
            var ascii_char = '♠'
        } else if (startGrid[i].suit == 'Clubs'){
            var ascii_char = '♣'
        } else if (startGrid[i].suit == 'Hearts'){
            var ascii_char = '♥'
        }

        div.innerHTML = '' + startGrid[i].name + '' + ascii_char + '';
        div.setAttribute('data-value', startGrid[i].name);
        cardContainer.appendChild(div);
    }

}


