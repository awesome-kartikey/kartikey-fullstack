// Type a value as Promise<number> and resolve it.
// Write async function add(a: number, b: number): Promise<number> using return a + b.
// Convert a callback-style function to return a Promise.
// Explain the difference: creating a promise vs awaiting one.

const numPromise: Promise<number> = new Promise((resolve) => {
  resolve(42);
});

numPromise.then((num) => {
  console.log("Got number:", num);
});

async function addNumbers(a: number, b: number) {
  return a + b;
}

addNumbers(1, 2).then((sum) => {
  console.log("Sum:", sum);
});

/******************************************************************************/
function callbackfunc(callback: (result: number) => void) {
  setTimeout(() => {
    callback(123);
  }, 1000);
}

function promisefunc(): Promise<number> {
  return new Promise((resolve, reject) => {
    callbackfunc((value) => {
      resolve(value);
    });
  });
}

promisefunc().then((v) => console.log("Value:", v));

// Explain the difference: creating a promise vs awaiting one.
// Creating: you build a Promise object (it starts work immediately).
// Awaiting: you pause inside an async function until the promise finishes.