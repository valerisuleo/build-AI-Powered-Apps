import pkg from "tiktoken";
const { get_encoding } = pkg;

const encoding = get_encoding("cl100k_base");

const text = "Hello world, this is the first test of the TikToken library.";
const tokens = encoding.encode(text);

console.log(tokens);
console.log("Token count:", tokens.length);
