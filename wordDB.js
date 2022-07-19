import sqlite3 from "sqlite3";
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

export async function update(bool) {
  const db = await dbPromise;
  if (bool) {
    await db.migrate();
  }
  const randomInt = Math.round(Math.random() * 1);
  const source = randomInt === 0 ? "Words" : "UserWords";
  const query = `SELECT word FROM ${source} ORDER BY RANDOM() LIMIT 1;`;
  const result = await db.all(query);
  return result[0].word;
}

export async function submit(req, res) {
  const db = await dbPromise;
  const word = req.body.val.toLowerCase();

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
    return res.json({ msg: "Thank you. Word successfully added to DB!", code: "ADDED" });
  }

  return res.json({ msg: "Word is already in database. Thank you.", code: "USED" });
}
