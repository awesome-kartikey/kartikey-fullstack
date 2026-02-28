import fs from "fs";

console.log("1. Start");

setTimeout(() => {
  console.log("2. setTimeout (Timers Phase)");
}, 0);

setImmediate(() => {
  console.log("3. setImmediate (Check Phase)");
});

process.nextTick(() => {
  console.log("4. process.nextTick");
});

Promise.resolve().then(() => {
  console.log("5. Promise Microtask");
});

fs.readFile(practice.ts, () => {
  console.log("6. fs.readFile (Poll Phase)");

  setTimeout(() => {
    console.log("7. setTimeout inside I/O");
  }, 0);

  setImmediate(() => {
    console.log("8. setImmediate inside I/O");
  });
});

console.log("9. End");