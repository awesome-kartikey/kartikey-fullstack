// Drill Set 3: Buffers & Encodings¶
// Create a Buffer from a string.
// Convert a Buffer back to string.
// Show the difference between utf8 and base64 encoding.
// Allocate a Buffer of 10 bytes and fill with 0xff.
// Measure Buffer length in bytes vs string length in characters.

const buf = Buffer.from("Hello, Node.js", "utf8");
console.log("Buffer:", buf);
console.log("String:", buf.toString("utf8"));

const text = "Hello, Node.js";
const b1utf8 = Buffer.from(text, "utf8");
const b1base64 = Buffer.from(text, "base64");

console.log("UTF 8", b1utf8);
console.log("Base 64", b1base64);

const b2 = Buffer.alloc(10, 0xff);
console.log("Buffer B2:", b2);
console.log("Buffer length:", b2.length);

const newText = "Hello, Node.js 🚀";
console.log("String length:", newText.length);
console.log("Buffer length:", Buffer.byteLength(newText));
