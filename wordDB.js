import sqlite3 from "sqlite3";
import fetch from "node-fetch";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import express from "express";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, "public");
app.use(express.static(filePath));
app.use(express.urlencoded({ extended: true }));

let wordToBeGuessed = "";

const dbPromise = open({
  filename: "data.db",
  driver: sqlite3.Database,
});

export async function setup() {
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
  return wordToBeGuessed = wordToBeGuessed[0].word;
};

export async function update(req, res) {
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
  console.log("New word is: " + wordToBeGuessed);
}

export async function submit(req, res) {
  const db = await dbPromise;
  const word = req.body.word;

  if (!(word.split("").length === 5)) {
    return;
  }

  const response = await fetch(
    `https://dictionary-dot-sse-2020.nw.r.appspot.com/${word}`
  );

  if (response.status === 404) {
    return res.sendFile("error.html", { root: filePath });
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

  return res.sendFile("success.html", { root: filePath });
}
