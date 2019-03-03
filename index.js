const { Arr, Fn, ana } = require("@masaeedu/fp");
const fs = require("fs");
const wlp = require("word-list");

// Find all 8-letter words
const wordniks = fs.readdirSync("./words").map(f => `./words/${f}`);
const readWordnik = f =>
  JSON.parse(fs.readFileSync(f, "utf8")).searchResults.map(r => r.word);
const words8 = Arr[">>="](wordniks)(readWordnik);

// Load a dictionary of English words
const words = new Set(fs.readFileSync(wlp, "utf8").split("\n"));
const notReallyWords = new Set([
  "aking",
  "paten",
  "ering",
  "sain",
  "sains",
  "tains",
  "tach",
  "dere",
  "ach",
  "che",
  "tae",
  "tas",
  "tes",
  "dae",
  "ain",
  "ats",
  "ane",
  "sar",
  "ae",
  "ar",
  "te",
  "pa",
  "er",
  "re",
  "ti",
  "si",
  "ta",
  "ai",
  "st",
  "la",
  "ea",
  "ne",
  "pe",
  "al",
  "es",
  "ag"
]);

// Find the ones that are still words after you remove 1 character
const remove = i => s => s.slice(0, i) + s.slice(i + 1);
const dedupe = l => [...new Set(l)];
const substrings = w =>
  dedupe(
    Arr.range(w.length)
      .map(remove)
      .map(Fn["$"](w))
  );
const isWord = w => !notReallyWords.has(w) && words.has(w);
const subwords = w => substrings(w).filter(isWord);

// Make a word chain
const chain0 = words8.map(Arr.of);
const last = xs => xs[xs.length - 1];
const growChain = c => subwords(last(c)).map(sw => [...c, sw]);

const result = Fn.passthru(chain0)(Arr.replicate(6)(Arr["=<<"](growChain)));
console.log(result);

// => [starting, stating, sating, sting, sing, sin, in, I]
