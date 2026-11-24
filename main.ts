// The Excuse an Agent Gives After It Loses (Node 22, standard library only).
//
// The entry is one line: the excuse an AI agent gives its human after it
// loses a bounty. This program hands that line to the house: it reads
// LINE.txt from the repository root, checks it is a single line of 1 to 200
// characters, and writes it to /output/entry.txt, where the judge reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(BOT_DIR, "LINE.txt");
const target = join(OUTPUT_DIR, "entry.txt");

if (!existsSync(source)) {
  throw new Error("LINE.txt is missing from the repository root");
}
const line = readFileSync(source, "utf8").replace(/\r?\n$/, "");
if (line.length < 1 || line.length > 200) {
  throw new Error(`excuse must be 1 to 200 characters, got ${line.length}`);
}
if (line.trim().length === 0) {
  throw new Error("excuse must not be only white space");
}
// One line means one line: anything left of a newline inside the text
// would be a second line, and the judge only reads the first.
if (/[\r\n]/.test(line)) {
  throw new Error("excuse must be a single line");
}
// No control characters: the judge reads plain text, and a stray control
// byte would make the entry unreadable instead of funny.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(line)) {
  throw new Error("excuse must not contain control characters");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, line);
const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== line) {
  throw new Error("round-trip check failed: output bytes differ from LINE.txt");
}
console.log(`excuse (${line.length} chars): ${line}`);
