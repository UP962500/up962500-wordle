import sqlite3 from "sqlite3";
import fetch from "node-fetch";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import checkWord from "./wordCheck.js";
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

async function update() {
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
  return "New word is: " + wordToBeGuessed;
}

async function submit(req, res) {
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

app.get("/update", update);

app.get("/display", (req, res) => {
  res.json(wordToBeGuessed);
});

app.get("/submit", (req, res) => {
  res.sendFile("submit.html", { root: filePath });
});

app.get("/success", (req, res) => {
  res.sendFile("success.html", { root: filePath });
});

app.get("/error", (req, res) => {
  res.sendFile("error.html", { root: filePath });
});

app.post("/submit", submit);

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
  });
};

setup();
