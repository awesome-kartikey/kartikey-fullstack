// Drill Set 7: Events¶
// Create an EventEmitter.
// Add a listener for a custom event.
// Emit the event and handle the data.
// Add multiple listeners and see order of execution.
// Remove a listener and verify it no longer fires.

import { EventEmitter } from "events";

const emitter = new EventEmitter();

emitter.on("event", (data) => {
  console.log("Event emitted:", data);
});
emitter.emit("event", "Hello, Node.js");

emitter.on("ping", () => console.log("A"));
emitter.on("ping", () => console.log("B"));
emitter.off("ping", () => console.log("C"));
emitter.emit("ping");
