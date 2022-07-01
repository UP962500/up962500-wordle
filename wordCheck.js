// Function to break down guessed word and analyze it
const checkWord = (guesses, wordToBeGuessed) => {
  // Correct word guessed (Win scenario)
  if (guesses === wordToBeGuessed) {
    return "You win!";
  }

  guesses = guesses.split("");
  wordToBeGuessed = wordToBeGuessed.split("");
  // mergedArray = [...guesses, ...wordToBeGuessed];
  // Completely wrong word guessed with no matching letters
  if (!guesses.some((guess) => wordToBeGuessed.includes(guess))) {
    return "Completely wrong guess!";
  }

  // Incorrect word guessed, below logic analyzes guessed word
  if (guesses.join("") !== wordToBeGuessed.join("")) {
    const correctLetters = guesses.filter(
      (guess) =>
        wordToBeGuessed.includes(guess) &&
        !(guesses.indexOf(guess) === wordToBeGuessed.indexOf(guess))
    );
    const correctLettersAndPos = guesses.filter(
      (guess) =>
        wordToBeGuessed.includes(guess) &&
        guesses.indexOf(guess) === wordToBeGuessed.indexOf(guess)
    );
    const wrongLetters = guesses.filter(
      (guess) => !wordToBeGuessed.includes(guess)
    );

    const allArrays = {
      correctLettersArray: [],
      correctLettersAndPosArray: [],
      wrongLettersArray: [],
    };

    // Correct letters guessed with wrong positions
    for (let i = 0; i < correctLetters.length; i++) {
      const correctLettersIndex = guesses.indexOf(correctLetters[i]);
      allArrays.correctLettersArray.push(correctLettersIndex);
    }

    // Correct letters guessed with correct positions
    for (let i = 0; i < correctLettersAndPos.length; i++) {
      let correctLettersAndPosArray = [];
      const correctLettersAndPosIndex = guesses.indexOf(
        correctLettersAndPos[i]
      );
      allArrays.correctLettersAndPosArray.push(correctLettersAndPosIndex);
    }

    // Incorrect letters guessed
    for (let i = 0; i < wrongLetters.length; i++) {
      let wrongLettersArray = [];
      const wrongLettersIndex = guesses.indexOf(wrongLetters[i]);
      allArrays.wrongLettersArray.push(wrongLettersIndex);
    }

    return allArrays;
  }
};

export default checkWord;
