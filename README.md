# UP962500 Wordle

A better version of the popular game known as "Wordle" created by me.

# What makes this version better?

- No cheating! Users cannot inspect the client code to find the word that they need to guess.
- "Play Again" feature that allows user to play as many times as they want with a random word selected each time.
- Users are allowed to submit their own words to be used in a game of Wordle given that it is a 5 letter valid dictionary word!

# Explanation of how game logic works

1. You have 6 chances to guess what the word is, and each guess will be accepted as long as it is a valid dictionary word. The word of the day is automatically retrieved from an sqlite database.
  
2. All words are verified to be valid or invalid using a dictionary API. If you type in an invalid word to try to cheat, it will not count as a guess.
  
3. Once you guess a valid word and press enter, you will see each tile of the row you guessed turn a certain color depending on whether it is correct or not.
  
   - Green: Correct letter guessed and it is in the correct position.
   - Yellow: Correct letter guessed but it is in the wrong position.
   - Grey: Incorrect letter (letter not in word).
  
4. If you run out of guesses and do not get it right, a "Game Over! You Lose." message will be displayed.
  
5. If you guess the correct word, all the tiles of that row will turn green and a "Congratulations! You win." message will be displayed.
  
6. You have the option to to play an unlimited amount of times by pressing the "Play Again!" button to reset everything (including all your guesses) and start again with a new word. Each time you press the "Play Again!" button, a new random word will be generated from the database.
  
# Requirements

- Must have NodeJS installed

# Usage

1. Run npm install  
2. Run npm start  
3. Navigate to localhost:8080 in your browser
