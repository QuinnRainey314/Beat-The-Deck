# Beat the Deck - A Simple Card Game

[![GitHub Pages Status](https://github.com/QuinnRainey314/Beat-The-Deck/deployments/github-pages)](https://github.com/QuinnRainey314/Beat-The-Deck)

## Overview

**Beat the Deck** is a single-player card game built with HTML, CSS, and JavaScript.  The goal is to predict whether the next card drawn from the deck will be higher or lower than the top card on a chosen stack.

## Play the Game

[Play Beat the Deck Now!](https://quinnrainey314.github.io/Beat-The-Deck/)  

## Features

*   **Adjustable Difficulty:** Change the number of starting stacks via a slider.
*   **Sound Effects:**  Sounds for dealing, correct/incorrect guesses, win/loss, and clicks.
*   **Responsive Design:**  Plays well on desktops, tablets, and phones.
*   **Clean UI:** Simple and intuitive interface.
*   **Rules Page:** In-game rules explanation.
*   **Play Again:** Restart easily after a game.

## How to Play

1.  **Setup:**  The game starts with a shuffled 52-card deck.  Some cards are dealt face-up into stacks (default: 9). The remaining cards are the draw pile.
2.  **Gameplay:**
    *   Click a stack to select it.
    *   Click "Higher" or "Lower" to bet on the next card's value (Ace is high).
    *   Correct guess: The card is added to the stack.
    *   Incorrect guess: The stack is flipped (grayed out) and is unusable.
3.  **Win/Lose:**
    *   **Win:** Use all cards in the draw pile before all stacks are flipped.
    *   **Lose:** All stacks are flipped before the draw pile is empty.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript
*   Web Audio API
*   GitHub Pages

## Project Structure
beat-the-deck/
├── index.html       <-- Main HTML
├── style.css        <-- CSS
├── script.js        <-- JavaScript
├── sounds/          <-- Sound effects (.wav)
│   ├── deal.wav
│   ├── correct.wav
│   ├── incorrect.wav
│   ├── win.wav
│   ├── lose.wav
│   ├── click.wav
│   └── hover.wav
└── README.md        <-- This file

## How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/QuinnRainey314/Beat-The-Deck.git](https://www.google.com/search?q=https://github.com/QuinnRainey314/Beat-The-Deck.git)
    ```
2.  **Navigate to the directory:**

    ```bash
    cd beat-the-deck
    ```
3.  **Open `index.html` in your browser.** No local server is needed.

## Contributing

Contributions are welcome! Open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Sound Effects

The sound effects were obtained from [Freesound](https://freesound.org/) and are used under Creative Commons licenses.

*  'click.wav' - WD-40 less than half Full - Fingernail tap center of bottle - 45degree incline heled at cap - 14 by Sadiquecat | License: Creative Commons 0
*  2690_VIAL_TAP_BR F#1 TMc.aif by The_Sample_Workshop | License: Attribution 4.0 
* 'deal.wav' - Card Shuffle.wav by TaXMaNFoReVeR | License: Attribution NonCommercial 4.0 
* 'correct.wav' deck of cards.wav by hmilleo | License: Creative Commons 0 
* 'incorrect.wav' - Incorrect Buzzer by Producing_RayLite | License: Creative Commons 0 
* 'lose.wav' - You Lose.mp3 by grizzlymittz | License: Creative Commons 0
* 'win.wav'- WinBrass.wav by Fupicat | License: Creative Commons 0
* 'hover.wav' - Contact1.wav by BMacZero | License: Creative Commons 0
