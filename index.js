import sqlite3 from "sqlite3";
import fetch from "node-fetch";
import { open } from "sqlite";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import checkWord from "./wordCheck.js";
const require = createRequire(import.meta.url);
const express = require("express");

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

let wordToBeGuessed = "";

const dbPromise = open({
  filename: "data.db",
  driver: sqlite3.Database,
});

app.get("/", (req, res) => {
  res.send("index");
});

app.get("/check/:word", async (req, res) => {
  const response = checkWord(
    req.params.word.toUpperCase(),
    wordToBeGuessed.toUpperCase()
  );
  res.json(response);
});

app.get("/update", async (req, res) => {
  const db = await dbPromise;
  let randomInt = Math.round(Math.random() * 1);
  if (randomInt === 0) {
    wordToBeGuessed = await db.all(
      "SELECT * FROM Words ORDER BY RANDOM() LIMIT 1;"
    );
  } else {
    wordToBeGuessed = await db.all(
      "SELECT * FROM UserWords ORDER BY RANDOM() LIMIT 1;"
    );
  }
  wordToBeGuessed = JSON.stringify(wordToBeGuessed);
  wordToBeGuessed = JSON.parse(wordToBeGuessed);
  wordToBeGuessed = wordToBeGuessed[0].word;
  return console.log("New word is: " + wordToBeGuessed);
});

app.get("/submit", (req, res) => {
  res.sendFile(__dirname + "/public/submit.html");
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/public/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/public/error.html");
});

app.post("/submit", async (req, res) => {
  const db = await dbPromise;
  const word = req.body.word;

  if (!(word.split("").length === 5)) {
    return;
  }

  const response = await fetch(
    `https://dictionary-dot-sse-2020.nw.r.appspot.com/${word}`
  );

  if (response.status === 404) {
    return res.sendFile(__dirname + "/public/error.html");
  }

  const duplicate = await db.get(
    "SELECT word FROM Words WHERE word = ?",
    `${word}`
  );
  const userWordsduplicate = await db.get(
    "SELECT word FROM UserWords WHERE word = ?",
    `${word}`
  );

  if (!duplicate && !userWordsduplicate) {
    await db.run("INSERT INTO UserWords (word) VALUES (?);", word);
    console.log("Word added to database!");
  }

  res.sendFile(__dirname + "/public/success.html");
});

const setup = async () => {
  const db = await dbPromise;
  await db.migrate();
  // randomInt will decide which table to select values from
  let randomInt = Math.round(Math.random() * 1);
  if (randomInt === 0) {
    wordToBeGuessed = await db.all(
      "SELECT * FROM Words ORDER BY RANDOM() LIMIT 1;"
    );
  } else {
    wordToBeGuessed = await db.all(
      "SELECT * FROM UserWords ORDER BY RANDOM() LIMIT 1;"
    );
  }
  wordToBeGuessed = JSON.stringify(wordToBeGuessed);
  wordToBeGuessed = JSON.parse(wordToBeGuessed);
  wordToBeGuessed = wordToBeGuessed[0].word;
  app.listen("8080", () => {
    console.log("Server is up on port 8080.");
    console.log("First word is: " + wordToBeGuessed);
  });
};

setup();
