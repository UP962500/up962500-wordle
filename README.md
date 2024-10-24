# A Better Wordle

A better version of the popular game known as "Wordle" created by me.  

You can play my custom version of Wordle here: https://a-better-wordle.onrender.com

# What makes this version better?

- No cheating! Users cannot inspect the client code to find the word that they need to guess. This is because word validation is done server-side in this version of Wordle.
- "Play Again" feature that allows user to play as many times as they want with a random word selected each time.
- Users are allowed to submit their own words to be used in a game of Wordle given that it is a 5 letter valid dictionary word.
- Added a QoL feature that allows users to click on a letter in the word to edit it instead of having to delete the entire word.

# Game Logic Explanation

1. You have 6 chances to guess what the word is, and each guess will be accepted as long as it is a valid dictionary word. The word of the day is automatically retrieved from an sqlite database.

2. All words are verified to be valid or invalid using a dictionary API. If you type in an invalid word to try to cheat, it will not count as a guess.

3. Once you guess a valid word and press enter, you will see each tile of the row you guessed turn a certain color depending on whether it is correct or not.

   - Green: Correct letter guessed and it is in the correct position.
   - Yellow: Correct letter guessed but it is in the wrong position.
   - Grey: Incorrect letter (letter not in word).

4. If you run out of guesses and do not get it right, a "Game Over! You Lose. The word was X" message will be displayed where X would be the word you were supposed to guess.

5. If you guess the correct word, all the tiles of that row will turn green and a "Congratulations! You win." message will be displayed.

6. You have the option to to play an unlimited amount of times by pressing the "Play Again!" button to reset everything (including all your guesses) and start again with a new word. Each time you press the "Play Again!" button, a new random word will be generated from the database.

# Game Logic Implementation

1. I started off by initializing a few global variables that I used to make the keyboard and to track certain things about where the users position was on the board. The global variables I used are:

   - buttons: This was an array I created with all the values of the alphabet letters in a keyboard in order to make it easier to make event listeners for each key. With an array like this, I was able to create event listeners for all those buttons with a simple for loop, instead of manually writing out each event listener for each key.

   - currentRowPos: This is what I used to track what ROW the user was currently on. The only time this variable was incremented was when the user hit enter and their word was confirmed to be VALID by the dictionary API I used, because once the user has guessed 5 letters and hits enter (and their word is valid), that is the only time that their ROW position will be changed.

   - currentColumnPos: This is what I used to track what COLUMN the user was currently on. Each time the user guessed a letter, the value of currentColumnPos was incremented.

   - guesses: This was the array I used to track each letter the user guessed. So each time the user guessed a letter, that letter was pushed into the array, so when the user hits enter, this array will contain their 5 letters guessed and this is what will be used to compare their guess to the actual word. This "guesses" array was key to me implementing the logic of Wordle.

   - positionCount: This was variable I used to track how far into the grid the user was currently at, irregardless of the row or column. So if the user was on ROW 2 COLUMN 1, the positionCount would be 6 as they are on the 6th total tile. I used this variable later on to clear the grid of all content for my "Play Again!" feature (which I have explained further below).

1. When the user hits enter, the guesses array is what I use to see what word the user guessed. But since guesses is an array, I have to turn it into a string using the .join method and I then use the dictionary API to validate the word. The response code sent back from the API is what I use to know if it was confirmed to be valid or not. After validation, I make a fetch request to my "check" endpoint on my server (the server is where the word is stored, I will explain more about this in step 3), where I compare the users guess to the actual word. I have a module called "wordCheck.js" that has all the code for actually analyzing the users guess and deciding which colour each letter will receive. The check endpoint will then respond with a JSON response that I can then safely use in my client-side and from there, I am able to identify which letters should be green, yellow, or grey, by using if statements and JavaScript to add CSS classes that will colour each letter.

1. Further explanation on server-side: The server-side is where I grab the word needed from the SQLITE database to avoid the word ever reaching the client. It is also where the users guess will be analyzed to decide which colour each letter of their guess will receive. I have a seperate module called "wordCheck.js" that has all the code for breaking down each guess. In there, I made use of the .join, .split, .filter, .indexOf, and the .some methods quite a bit. Whenever I would like the users guess to be a string (for comparison reasons), I turn it into a string using .join(''), and whenever I need the users guess to be an array, I use .split('') to turn it into an array, and I can then use .filter and .indexOf and .some (which are all extremely useful array methods) to figure out which letters were correct/incorrect etc. The .indexOf method was especially useful when deciding whether the users letter was in the correct position or not, which is a very important part of the Wordle logic.

# Reasoning for Extra Features

1. The first feature is a "Play Again" button that allows the user to play as many times as they want with a random word selected each time. I added this because one of the major things that bothered me with the original Wordle is the fact that you can only play once a day essentially as you are only given one word per day. I think this makes it boring for users who guess the word too quickly, and I think it is a disadvantage to users who are bad at Wordle and are trying to get better, because one word a day is not enough practice. I also think this feature will be good for the people who really enjoy Wordle and want to play more than just once a day.

2. The second feature is a submit option that allows users to submit their own words to be used in a game of Wordle given that it is a 5 letter valid dictionary word! I understand that a feature like this isn't too useful since I already have enough words to be used from my database, however, I really felt like a feature like this would enhance user experience because it allows the user to feel more involved in the process of the game. I also learned a lot while building this feature so I believe it was worth it overall.

# Extra Features Implementation

1. For the "Play Again!" feature, I started off by creating an event listener for the "Play Again!" button. I then had to use a for loop where I had my "i" value equal to the current positionCount (this is why I created this global variable) and I just incremented DOWN from there until we hit 1 (the first column of the first row). Now during this for loop, I cleared the textContent of every paragraph on the grid from the position the user was currently at until the beginning of the grid so it was all clear. I also made sure to remove any classLists that coloured any part of the grid so it would all be clear again. I then made a fetch request to my /update endpoint in my server which selects a new random word from the database to be used. Finally, I made sure to reset all the global variables that I used to track positions back to their starting values, including positionCount.

2. For the submit feature, I created a submit page that users can get to by clicking the submit text on the homepage. I also created a "submit.js" file that contains the client-side code for the submit.html page. This client-side code has an event listener wired on the submit button, and when the user clicks submit, the users word is checked to make sure it is of length 5, and then validated using the same dictionary API I used in my index.js client-side code. If the users word is not of length 5, an appropriate message is show on screen, if it is not a valid word, an appropriate message is shown on screen. If the users word is of length 5 and is a valid word, a fetch POST request is sent to the /submit endpoint which I have set up in my server. Now, when it is sent to the server, the word is also checked against my current database to make sure it is not already there, if it is, it won't be added as the word the user input is already in the database, and the user will see a message explaining to them that their word is already in the database.

# Requirements

- Must have NodeJS installed

# Install

1. Run npm install
2. Run npm start
3. Navigate to localhost:8080 in your browser
