console.time("operation");

// Simulate work
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}

console.timeEnd("operation");
console.log("Sum:", sum);

// Multiple timers
console.time("loop1");
for (let i = 0; i < 500000; i++) {}
console.timeEnd("loop1");

console.time("loop2");
for (let i = 0; i < 1000000; i++) {}
console.timeEnd("loop2");
