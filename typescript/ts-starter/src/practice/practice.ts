// const practicepromise = new Promise<number>((resolve, reject) => {
//     resolve(123);
// })

// async function asyncpracticepromise(): Promise<number> {
//     const result = await practicepromise;
//     console.log(result);
//     return result;
// }
// asyncpracticepromise();

// const stringpromise = new Promise<string>((resolve, reject) => {
//     resolve("hello world!");
// })

// async function asyncstringpromise(): Promise<string> {
//     const result = await stringpromise;
//     console.log(result);
//     return result;
// }
// asyncstringpromise();

type asyncuser = {
  id: string;
  name: string;
  age: number;
};

const users: asyncuser[] = [
  {
    id: "1",
    name: "John Doe",
    age: 30,
  },
  {
    id: "2",
    name: "Jane Doe",
    age: 25,
  },
];
async function fetchuser(id: string): Promise<asyncuser> {
  // how to use await rather than Promise in here to fetch the user from the users array? using setTimeout to simulate an asynchronous operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((user) => user.id === id);
      if (!user) {
        reject(new Error("User not found"));
      } else {
        resolve(user);
      }
    }, 1000);
  });
}

// async function main() {
//   const user = await fetchuser("1");
//   console.log(user);
// }
// main();

// console.log(fetchuser("2"));
// fetchuser("2").then(user => console.log(user));

// Version 1: Sequential (one after the other)
async function fetchSequential() {
  // fetch user "1", then fetch user "2"
  // measure time using Date.now() before and after
  // log how long it took
  console.log("Fetching users sequentially...");
  const start = Date.now();
  const user1 = await fetchuser("1");
  const user2 = await fetchuser("2");
  const end = Date.now();
  console.log(`Fetched users sequentially in ${end - start} ms`);
}

// Version 2: Parallel (using Promise.all)
async function fetchParallel() {
  // same thing but with Promise.all
  // compare the time!
  console.log("Fetching users in parallel...");
  const start = Date.now();
  const [user1, user2] = await Promise.all([fetchuser("1"), fetchuser("2")]);
  const end = Date.now();
  console.log(`Fetched users in parallel in ${end - start} ms`);
}
// fetchSequential();
// fetchParallel();

// function using Promise.allSettled that fetches users "1", "2", and "999", then logs only the successfully fetched users

async function fetchAllSettled() {
  // console.log("Fetching users with Promise./allSettled...");
  const results = await Promise.allSettled([fetchuser("1"), fetchuser("2"), fetchuser("999")]);
  const successfulUsers = results
    .filter((r): r is PromiseFulfilledResult<asyncuser> => {
      return r.status === "fulfilled";
    })
    .map((r) => {
      return r.value;
    });
  console.log(successfulUsers);
  // console.log("Successfully fetched users:", successfulUsers);
}
// fetchAllSettled();

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // 1. Create a timeout promise that rejects after ms milliseconds
  // 2. Race your promise against it
  const car1 = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      reject("Timed out!");
    }, ms);
  });
  return Promise.race([promise, car1]);
}

// withTimeout(fetchuser("1"), 500)
//   .then((user) => console.log(user))
//   .catch((err) => console.log(err));

// // Should TIMEOUT (fetchuser takes 1000ms, we allow only 500ms)
// withTimeout(fetchuser("1"), 500).catch((err) => console.log(err)); // "Timed out!"

// // Should SUCCEED (we allow 2000ms, plenty of time)
// withTimeout(fetchuser("1"), 2000).then((user) => console.log(user)); // { id: "1", name: "John Doe" ... }

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retry<T>(
    operation: () => Promise<T>,  // a FUNCTION that returns a promise
    attempts: number,
    backoffMs: number
): Promise<T> {
    for (let i = 0; i < attempts; i++) {
        try {
            // attempt the operation...
        } catch (error) {
            // if last attempt, throw
            // otherwise sleep then continue
        }
    }
    throw new Error("Should never reach here");
}