import z from "zod";
// function delayedDouble(x: number, callback: (result: number) => void) {
//   setTimeout(() => {
//     callback(x * 2);
//   }, 1000);
// }

// delayedDouble(6, (res) => {
//     console.log(res)
// })

// function delayedDouble(x: number): Promise<number> {
//     return new Promise((resolve) => {
//         return resolve(x*2)
//     });
// }
// delayedDouble(6).then((res)=>{console.log(res)})

// delayedDouble(6).then((res) => {
//   console.log(res);
// });

// async function main() {
//     const res = await delayedDouble(6);
//     console.log(res)
// }
// main()

/**********************************/
const sleep1 = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

type User = {
  id: number;
  name: string;
};

type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: string }

const sampleUser: User[] = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
  { id: 3, name: "user3" },
];

async function fetchUser(id: string): Promise<Result<string>> {
  console.log(`fetchUser(${id}) started at ${Date.now()}`)
  await sleep1(1000);
  const user = sampleUser.find((u) => u.id === Number(id));
  if (user) {
    return {ok: true, value: user.name};
  } else {
    return {ok: false, error: "User not found"};
  }
}

// fetchUser("1").then((p)=>console.log(p))
// fetchUser("2").then((p)=>console.log(p))
// async function asyncfetchUser() {
//     const a = await fetchUser("1")
//     console.log(a)
//     const b = await fetchUser("2")
//     console.log(b)
// }
// asyncfetchUser()

// async function asyncallfetchUser() {
//     const [a,b] = await Promise.all([fetchUser("1"),fetchUser("2")])
//     console.log(a)
//     console.log(b)
// }
// asyncallfetchUser()
// async function asyncallsettedfetchUser() {
//   const a = await Promise.allSettled([fetchUser("1"), fetchUser("2"), fetchUser("999")]);

//   a.map((res) => {
//     if (res.status === "fulfilled") {
//       console.log(res.value);
//     } else {
//       console.log(res.reason);
//     }
//   });
// }
// asyncallsettedfetchUser();

// function timeout10<T>(p: Promise<T>, ms: number): Promise<T> {
//   const timerPromise = new Promise<T>((resolve, reject) => {
//     return setTimeout(() => {
//       return reject("TimeOut");
//     }, ms);
//   });

//   return Promise.race([p, timerPromise]);
// }

// timeout10(fetchUser("1"), 500)
// .then((o)=> {console.log(o)})
// .catch((er)=> {console.log(er)})

// async function retry<T>(op: () => Promise<T>, attempts: number, backoffMs: number): Promise<T> {
//   for (let i = 0; i < attempts; i++) {
//     try {
//       return await op();
//     } catch (error) {
//       if (i === attempts - 1) {
//         throw new Error(`Attempts ${i + 1}`);
//       }
//       await sleep1(backoffMs);
//     }
//   }
//   throw new Error("Unable to reach...");
// }

// let callCount = 0;

// async function unreliableOp(): Promise<String> {
//   callCount++;
//   try {
//     if (callCount < 3) {
//       throw new Error("Not Ready Yet");
//     }
//   } catch (Error) {
//     console.log(Error);
//   }
//   return "Success";
// }
// retry(unreliableOp, 2, 500)
//   .then((o) => console.log(o))
//   .catch((er) => console.log(er));

// const sleep2 = (ms: number) => {
//   return new Promise((resolve) => {
//     console.log("Inside Promise")
//     setTimeout(() => {
//       console.log("Inside settimeout")
//       return resolve("done");
//     }, ms);
//   });
// };

// async function test() {
//   console.log("before");
//   await sleep2(1000);
//   console.log("after"); // should appear 1 second later
// }
// test();

// async function mockFetch(signal: AbortSignal): Promise<string> {
//   return new Promise((resolve, reject) => {
//     signal.addEventListener("abort", () => {
//       reject("Request was aborted");
//     });

//     setTimeout(() => {
//       resolve("fetched data");
//     }, 2000);
//   });
// }

// function withTimeoutSignal(ms: number): AbortSignal {
//   const controller = new AbortController();

//   setTimeout(() => controller.abort(), ms);

//   return controller.signal;
// }

// mockFetch(withTimeoutSignal(1000))
//   .then((data) => console.log("Test 1:", data))
//   .catch((err) => console.log("Test 1:", err));

// mockFetch(withTimeoutSignal(3000))
//   .then((data) => console.log("Test 2:", data))
//   .catch((err) => console.log("Test 2:", err));

// class Semaphore {
//   private limit: number;
//   private running: number = 0;

//   constructor(limit: number) {
//     this.limit = limit;
//   }

//   async aquire(): Promise<void> {
//     while (this.running >= this.limit) {
//       await sleep1(50);
//     }
//     this.running++;
//   }
//   release(): void {
//     this.running--;
//   }
// }
// const tasks = [() => fetchUser("1"), () => fetchUser("3"), () => fetchUser("2")];

// async function runWithLimit<T>(limit: number, tasks: (() => Promise<T>)[]): Promise<T[]> {
//   const semaphore = new Semaphore(limit);

//   return Promise.all(
//     tasks.map(async (task) => {
//       await semaphore.aquire();
//       try {
//         const result = await task();
//         return result;
//       } finally {
//         semaphore.release();
//       }
//     }),
//   );
// }

// runWithLimit(2, tasks)
// .then((res)=> console.log(res))
// .catch((err)=> console.log(err))

const asyncresult = await fetchUser("1");

if(asyncresult.ok){
  console.log(asyncresult.value)
}
else{
  console.log(asyncresult.error)
}

type ApiResponse<T> = { status: number; data: T | null }

async function fetchUserApi(userid: string):Promise<ApiResponse<User>>{
  const findUser = sampleUser.find((u)=> u.id === Number(userid));

  if(findUser){
    return{status: 200, data: {id: Number(findUser?.id), name: String(findUser?.name)}}
  }
  else{
    return{status:404, data: null}
  }
}

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
})

async function typedFetch<T>(
  schema: z.ZodType<T>,
  input: string,
  init?: RequestInit
): Promise<T>{
  const response = await fetch(input, init);
  const json = await response.json();
  return schema.parse(json);
}

const zoduser = await typedFetch (UserSchema, "https://api.example.com/users/1")
