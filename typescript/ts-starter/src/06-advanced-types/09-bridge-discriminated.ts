type Result = { status: "ok"; value: number } | { status: "error"; message: string };

function logResult(result: Result) {
  switch (result.status) {
    case "ok":
      console.log(`Success! Value is: ${result.value.toFixed(2)}`);
      break;
    case "error":
      console.error(`Failure! Reason: ${result.message.toUpperCase()}`);
      break;
  }
}

