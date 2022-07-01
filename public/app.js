// Global variables to keep track of position and guesses
let buttons = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let currentRowPos = 1;
let currentColumnPos = 1;
let guesses = [];
let positionCount = 0;

// Create event listeners for every button except for Enter and Delete
for (let i = 0; i < buttons.length; i++) {
  let winMessage = document.querySelector(".win-message");
  let loseMessage = document.querySelector(".lose-message");
  let incorrectMessage = document.querySelector(".incorrect-message");
  winMessage.textContent = "";
  loseMessage.textContent = "";
  incorrectMessage.textContent = "";

  const button = document.querySelector(`.${buttons[i]}`);
  button.addEventListener("click", () => {
    const pressedButtonValue = button.value;
    console.log(currentRowPos, " ", currentColumnPos);
    const paragraph = document.querySelector(
      `.p-${currentRowPos}-${currentColumnPos}`
    );

    if (currentColumnPos > 5) {
      return;
    }

    if (currentColumnPos >= 6 && currentRowPos >= 6) {
      return;
    }

    button.classList.add("click");
    setTimeout(() => {
      button.classList.remove("click");
    }, "100");

    paragraph.textContent += pressedButtonValue;
    guesses.push(pressedButtonValue);
    console.log(guesses);
    currentColumnPos++;
    positionCount++;
  });
}

// Create event listener for Enter button
const enterButton = document.querySelector(".enter");

enterButton.addEventListener("click", async () => {
  enterButton.classList.add("click");
  setTimeout(() => {
    enterButton.classList.remove("click");
  }, "100");

  if (currentColumnPos > 5) {
    // Check for validity of word
    const response = await fetch(
      `https://dictionary-dot-sse-2020.nw.r.appspot.com/${guesses.join("")}`
    );

    // Word not in list message appears for invalid words
    if (response.status === 404) {
      const message = document.querySelector(".incorrect-message");
      message.textContent = "Word not in list!";
      setTimeout(() => {
        message.textContent = "";
      }, "2000");
      return;
    }

    const path = `check/${guesses.join("")}`;
    let wordCheckResponse = await fetch(path);
    wordCheckResponse = await wordCheckResponse.json();

    // Correct word guessed (Win scenario)
    if (wordCheckResponse === "You win!") {
      for (let i = 1; i < 6; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        paragraph.classList.add("flipAnimation");
        paragraph.classList.add("green");
      }
      const winMessage = document.querySelector(".win-message");
      return (winMessage.textContent = "Congratulations! You win.");
    }

    // Lose scenario, you have not won and no more guesses left
    if (currentRowPos >= 6) {
      const loseMessage = document.querySelector(".lose-message");
      loseMessage.textContent = "Game Over! You Lose.";
    }

    // Completely wrong word guessed with no matching letters
    if (wordCheckResponse === "Completely wrong guess!") {
      for (let i = 1; i < 6; i++) {
        const paragraphDiv = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        paragraphDiv.classList.add("flipAnimation");
        paragraphDiv.classList.add("grey");
      }
    }

    try {
      // Correct letters guessed with wrong positions
      for (let i = 0; i < wordCheckResponse.correctLettersArray.length; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${wordCheckResponse.correctLettersArray[i] + 1}`
        ).parentElement;
        paragraph.classList.add("flipAnimation");
        paragraph.classList.add("yellow");
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
        paragraph.classList.add("flipAnimation");
        paragraph.classList.add("green");
      }

      // Incorrect letters guessed
      for (let i = 0; i < wordCheckResponse.wrongLettersArray.length; i++) {
        const paragraph = document.querySelector(
          `.p-${currentRowPos}-${wordCheckResponse.wrongLettersArray[i] + 1}`
        ).parentElement;
        paragraph.classList.add("flipAnimation");
        paragraph.classList.add("grey");
      }

      // To handle duplicates
      for (let i = 1; i < 6; i++) {
        const paragraphDiv = document.querySelector(
          `.p-${currentRowPos}-${i}`
        ).parentElement;
        if (
          !paragraphDiv.classList.contains("green") &&
          !paragraphDiv.classList.contains("yellow") &&
          !paragraphDiv.classList.contains("grey")
        ) {
          paragraphDiv.classList.add("grey");
          paragraphDiv.classList.add("flipAnimation");
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
});

// Create event listener for Delete button
const deleteButton = document.querySelector(".Backspace");

deleteButton.addEventListener("click", () => {
  deleteButton.classList.add("click");
  setTimeout(() => {
    deleteButton.classList.remove("click");
  }, "100");

  const winMessage = document.querySelector(".win-message");
  if (winMessage.textContent === "Congratulations! You win.") {
    return;
  }

  const loseMessage = document.querySelector(".lose-message");
  if (loseMessage.textContent === "Game Over! You Lose.") {
    return;
  }

  if (currentColumnPos <= 1) {
    return;
  }

  guesses.pop();
  console.log(guesses);
  const paragraph = document.querySelector(
    `.p-${currentRowPos}-${currentColumnPos - 1}`
  );
  paragraph.textContent = "";
  positionCount--;
  currentColumnPos--;
});

// Event listener for key presses (so user can use keyboard)
document.addEventListener("keyup", (e) => {
  if (
    buttons.includes(e.key.toUpperCase()) ||
    e.key === "Enter" ||
    e.key === "Backspace"
  ) {
    document.querySelector(`.${e.key}`).click();
  }
});

// Event listener for "Play Again!" button
const playAgainButton = document.querySelector(".play");

playAgainButton.addEventListener("click", async () => {
  playAgainButton.classList.add("click");
  setTimeout(() => {
    playAgainButton.classList.remove("click");
  }, "100");

  console.log(positionCount);
  for (let i = positionCount; i >= 1; i--) {
    let winMessage = document.querySelector(".win-message");
    let loseMessage = document.querySelector(".lose-message");
    const paragraph = document.querySelector(`.p-${i}`);
    const paragraphDiv = document.querySelector(`.p-${i}`).parentElement;
    paragraph.textContent = "";
    paragraphDiv.classList.remove("green");
    paragraphDiv.classList.remove("yellow");
    paragraphDiv.classList.remove("grey");
    paragraphDiv.classList.remove("flipAnimation");
    winMessage.textContent = "";
    loseMessage.textContent = "";
  }

  positionCount = 0;
  currentRowPos = 1;
  currentColumnPos = 1;
  guesses = [];

  const path = "update/";
  await fetch(path);
});
