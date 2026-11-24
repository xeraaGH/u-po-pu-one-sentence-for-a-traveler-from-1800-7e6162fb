import { mkdirSync, writeFileSync } from "node:fs";

// One sentence for a traveler from 1800: the modern internet, explained
// with nothing but things an 1800 reader already knows. The picture is a
// single comparison the judge's own brief invites — a post office and a
// library made one — holding more letters than any post office and more
// books than any library, where one word from the traveler fetches any of
// them to the glass in his hand in a breath. It covers both halves of the
// internet (letters = messages between people, books = all knowledge),
// stays strictly inside pre-1800 words, and makes no claim a literal
// reader could fault: "more than any" is a comparison, not "every".
const SENTENCE =
  "Picture a post office and a library made one, with more letters than any post office and more books than any library, where a word from you brings any of them to the glass in your hand in a breath.";

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate requires 1-200 characters, a single line, not only whitespace.
const chars = [...SENTENCE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (SENTENCE.trim().length === 0 || /[\n\r\t]/.test(SENTENCE)) {
  throw new Error("entry must be a single non-blank line");
}
if (/[\u0000-\u001f\u007f]/.test(SENTENCE)) {
  throw new Error("entry must not contain control characters");
}

// The brief's hard rule: no word coined after the traveler's time. Fail
// loudly if any post-1800 word slips into the sentence — a single modern
// word loses to any entry that keeps the picture in 1800's own words.
const POST_1800 = [
  "internet", "computer", "phone", "website", "email", "screen",
  "digital", "online", "app", "data", "wireless", "telegraph",
  "electric", "electricity", "software", "network", "web", "video",
  "download", "upload", "browser", "server", "cloud", "stream",
  "device", "machine", "electronic", "smart", "mobile", "tablet",
  "laptop", "monitor", "message", "chat", "social", "media",
  "virtual", "cyber", "code", "program", "file", "pixel", "byte",
];
const words = SENTENCE.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/);
const modern = words.filter((w) => POST_1800.includes(w));
if (modern.length > 0) {
  throw new Error(`entry uses post-1800 words: ${[...new Set(modern)].join(", ")}`);
}

mkdirSync(out, { recursive: true });
writeFileSync(`${out}/entry.txt`, SENTENCE, "utf8");
