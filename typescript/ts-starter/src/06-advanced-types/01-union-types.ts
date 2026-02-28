// Declare type Status = "loading" | "success" | "error".
// Write a function handle(status: Status) with a switch.
// Add a case for all three values.
// Add a default and assign never to enforce exhaustiveness.

type Status = "loading" | "success" | "error";

function handle(status: Status) {
  switch (status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Success!");
      break;
    case "error":
      console.log("Error!");
      break;
    default:
      const exhaustiveCheck: never = status;
      throw new Error(`Unhandled status: ${exhaustiveCheck}`);
  }
}

handle("loading");
handle("success");
handle("error");
// handle("pending");
