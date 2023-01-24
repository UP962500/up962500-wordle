// Global variables to keep track of position and guesses
let buttons = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
let currentRowPos = 1;
let currentColumnPos = 1;
let oldColumnPos = 1;
let guesses = [];
let positionCount = 0;

function removeClass(buttonName, className) {
  setTimeout(() => {
    buttonName.classList.remove(`${className}`);
  }, '100');
}

// Create event listeners for every button except for Enter and Delete
for (let i = 0; i < buttons.length; i++) {
  let winMessage = document.querySelector('.win-message');
  let loseMessage = document.querySelector('.lose-message');
  let incorrectMessage = document.querySelector('.incorrect-message');
  winMessage.textContent = '';
  loseMessage.textContent = '';
  incorrectMessage.textContent = '';

  const button = document.querySelector(`.${buttons[i]}`);
  button.addEventListener('click', () => {
    const pressedButtonValue = button.value;
    const paragraph = document.querySelector(
      `.p-${currentRowPos}-${currentColumnPos}`
    );

    if (currentColumnPos > 5) {
      return;
    }

    if (currentColumnPos >= 6 && currentRowPos >= 6) {
      return;
    }

    if (pressedButtonValue === 'W') {
      paragraph.classList.add('w-letter');
    }

    if (pressedButtonValue === 'I') {
      paragraph.classList.add('i-letter');
    }

    if (pressedButtonValue === 'M') {
      paragraph.classList.add('w-letter');
    }

    if (pressedButtonValue === 'Q') {
      paragraph.classList.add('q-letter');
    }

    if (guesses.includes(-1)) {
      currentColumnPos++;
      const index = guesses.indexOf(-1);
      guesses[index] = pressedButtonValue;

      oldColumnPos = currentColumnPos;
      currentColumnPos = index;

      const newParagraph = document.querySelector(
        `.p-${currentRowPos}-${currentColumnPos + 1}`
      );

      button.classList.add('click');
      removeClass(button, 'click');

      newParagraph.textContent += pressedButtonValue;
      newParagraph.parentElement.classList.add('wordle');
      newParagraph.parentElement.classList.remove('orange');

      currentColumnPos = oldColumnPos;
      return;
    }

    button.classList.add('click');
    removeClass(button, 'click');

    paragraph.textContent += pressedButtonValue;
    paragraph.parentElement.classList.add('wordle');
    guesses.push(pressedButtonValue);
    currentColumnPos++;
    positionCount++;
  });
}

async function enterButtonFunction() {
  enterButton.classList.add('click');
  removeClass(enterButton, 'click');

  if (currentColumnPos > 5) {
    // Check for validity of word
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guesses.join('')}`
    );

    console.log(response);
    // Word not in list message appears for invalid words
    if (response.status === 404) {
      incorrectMessage.textContent = 'Word not in list!';
      setTimeout(() => {
        incorrectMessage.textContent = '';
      }, '2000');
      return;
    }

    const path = `check/${guesses.join('')}`;
    let wordCheckResponse = await fetch(path);
    wordCheckResponse = await wordCheckResponse.json();

    // Correct word guessed (Win scenario)
    if (wordCheckResponse === 'You win!') {
      for (let i = 1; i < 6; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        paragraph.classList.add('flipAnimation');
        paragraph.classList.add('green');
      }
      return (winMessage.textContent = 'Congratulations! You win.');
    }

    // Lose scenario, you have not won and no more guesses left
    if (currentRowPos >= 6) {
      const path = '/display';
      let response = await fetch(path);
      response = await response.json();
      loseMessage.textContent = `Game Over! You Lose. The word was ${response}.`;
    }

    // Completely wrong word guessed with no matching letters
    if (wordCheckResponse === 'Completely wrong guess!') {
      for (let i = 1; i < 6; i++) {
        const paragraphDiv = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        paragraphDiv.classList.add('flipAnimation');
        paragraphDiv.classList.add('grey');
      }
    }

    try {
      // Correct letters guessed with wrong positions
      for (let i = 0; i < wordCheckResponse.correctLettersArray.length; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${wordCheckResponse.correctLettersArray[i] + 1}`
        ).parentElement;
        paragraph.classList.add('flipAnimation');
        paragraph.classList.add('yellow');
      }

      // Correct letters guessed with correct positions
      for (
        let i = 0;
        i < wordCheckResponse.correctLettersAndPosArray.length;
        i++
      ) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${
            wordCheckResponse.correctLettersAndPosArray[i] + 1
          }`
        ).parentElement;
        paragraph.classList.add('flipAnimation');
        paragraph.classList.add('green');
      }

      // Incorrect letters guessed
      for (let i = 0; i < wordCheckResponse.wrongLettersArray.length; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${wordCheckResponse.wrongLettersArray[i] + 1}`
        ).parentElement;
        paragraph.classList.add('flipAnimation');
        paragraph.classList.add('grey');
      }

      // To handle duplicates
      for (let i = 1; i < 6; i++) {
        const paragraphDiv = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        if (
          !paragraphDiv.classList.contains('green') &&
          !paragraphDiv.classList.contains('yellow') &&
          !paragraphDiv.classList.contains('grey')
        ) {
          paragraphDiv.classList.add('grey');
          paragraphDiv.classList.add('flipAnimation');
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (currentRowPos >= 6) {
      return;
    }

    guesses = [];
    currentColumnPos = 1;
    currentRowPos++;
    return;
  }
}

function deleteButtonFunction() {
  deleteButton.classList.add('click');
  removeClass(deleteButton, 'click');

  if (winMessage.textContent === 'Congratulations! You win.') {
    return;
  }

  if (loseMessage.textContent === 'Game Over! You Lose.') {
    return;
  }

  if (currentColumnPos <= 1) {
    return;
  }

  if (guesses.includes(-1)) {
    return;
  }

  guesses.pop();
  const paragraph = document.querySelector(
    `.p-${currentRowPos}-${currentColumnPos - 1}`
  );
  paragraph.textContent = '';
  paragraph.classList.remove('w-letter');
  paragraph.classList.remove('i-letter');
  paragraph.classList.remove('q-letter');
  paragraph.parentElement.classList.remove('wordle');
  positionCount--;
  currentColumnPos--;
}

function keyboardFunction(e) {
  if (
    buttons.includes(e.key.toUpperCase()) ||
    e.key === 'Enter' ||
    e.key === 'Backspace'
  ) {
    document.querySelector(`.${e.key}`).click();
  }
}

async function playAgainFunction() {
  playAgainButton.classList.add('click');
  removeClass(playAgainButton, 'click');

  for (let i = positionCount; i >= 1; i--) {
    const paragraph = document.querySelector(`.p-${i}`);
    const paragraphDiv = document.querySelector(`.p-${i}`).parentElement;
    paragraph.textContent = '';
    paragraph.classList.remove('w-letter');
    paragraphDiv.classList.remove('green');
    paragraphDiv.classList.remove('yellow');
    paragraphDiv.classList.remove('grey');
    paragraphDiv.classList.remove('flipAnimation');
    paragraphDiv.classList.remove('wordle');
    winMessage.textContent = '';
    loseMessage.textContent = '';
  }

  positionCount = 0;
  currentRowPos = 1;
  currentColumnPos = 1;
  guesses = [];

  const path = '/update';
  await fetch(path);
}

function clickTile() {
  for (let i = 1; i <= 6; i++) {
    const row = document.querySelector(`.wordle-board-row-${i}`);
    for (let j = 0; j <= 4; j++) {
      row.children[j].addEventListener('click', () => {
        if (guesses.length === 0) {
          return;
        }

        if (guesses.length === 4) {
          if (j + 1 > 3) {
            return;
          }
        }

        if (i !== currentRowPos) {
          return;
        }

        if (guesses.includes(-1)) {
          return;
        }

        currentColumnPos--;
        guesses[j] = -1;
        const paragraph = document.querySelector(`.p-${i}-${j + 1}`);
        paragraph.textContent = '';
        paragraph.parentElement.classList.add('orange');
        paragraph.classList.remove('w-letter');
        paragraph.classList.remove('i-letter');
        paragraph.classList.remove('q-letter');
        paragraph.parentElement.classList.remove('wordle');
      });
    }
  }
}

function prepareHandles() {
  let winMessage = document.querySelector('.win-message');
  let loseMessage = document.querySelector('.lose-message');
  let incorrectMessage = document.querySelector('.incorrect-message');
  const enterButton = document.querySelector('.enter');
  const deleteButton = document.querySelector('.Backspace');
  const playAgainButton = document.querySelector('.play');
}

function addEventHandlers() {
  enterButton.addEventListener('click', enterButtonFunction);
  deleteButton.addEventListener('click', deleteButtonFunction);
  document.addEventListener('keyup', keyboardFunction);
  playAgainButton.addEventListener('click', playAgainFunction);
}

function pageLoaded() {
  prepareHandles();
  addEventHandlers();
  clickTile();
}

window.addEventListener('load', pageLoaded);

let winMessage = document.querySelector('.win-message');
let loseMessage = document.querySelector('.lose-message');
let incorrectMessage = document.querySelector('.incorrect-message');

const enterButton = document.querySelector('.enter');
const deleteButton = document.querySelector('.Backspace');
const playAgainButton = document.querySelector('.play');

enterButton.addEventListener('click', enterButtonFunction);
deleteButton.addEventListener('click', deleteButtonFunction);
document.addEventListener('keyup', keyboardFunction);
playAgainButton.addEventListener('click', playAgainFunction);
