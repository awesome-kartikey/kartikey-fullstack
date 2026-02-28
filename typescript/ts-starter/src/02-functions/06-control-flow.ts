// 6) Control Flow with Types¶
// Write a function isEven(n: number) returning boolean.
// Use it in an if statement.
// Write a while loop that decrements a counter until zero.
// Write a switch statement on a string union type ("start" | "stop").
// Add a never case to ensure exhaustiveness. How ????


function isEven(n: number): boolean {
  return n % 2 === 0;
}

if (isEven(4)) {
  console.log("4 is even");
}

/******************************************************************************/
function countdown(n: number): void {
  while (n > 0) {
    console.log(n);
    n--;
  }
}
countdown(5);

/******************************************************************************/
type Command = "start" | "stop";

function isStartOrStop(cmd: Command) {
  switch (cmd) {
    case "start":
      return "started...";
    case "stop":
      return "stoped...";
    default:
      const exhaustive: never = cmd;
      throw new Error(`Unhandled command: ${exhaustive}`);
  }
}

console.log(isStartOrStop("start"));
