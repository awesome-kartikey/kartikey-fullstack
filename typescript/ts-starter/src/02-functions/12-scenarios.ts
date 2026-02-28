// 12) Practical Function Scenarios¶
// Create a user validation function with multiple checks.

type validUser = {
  valid: boolean;
  message: string;
};

function validateUser(age: number, username: string): validUser {
  if (age < 18) {
    return {
      valid: false,
      message: "User must be at least 18 years old",
    };
  }
  if (username.length < 5) {
    return {
      valid: false,
      message: "Name must be at least 5 characters",
    };
  }
  return {
    valid: true,
    message: "User is valid",
  };
}

console.log(validateUser(16, "ram"));
console.log(validateUser(21, "ram"));
console.log(validateUser(21, "Yeahhhh"));

/******************************************************************************/
// Write a data transformation function using rest parameters.

function dataTransformer(...items: (string | number)[]): string {
  return items.join("| ");
}

console.log(dataTransformer("a", 1, "b", 2.5));

/******************************************************************************/

// Build a configuration function with default parameters.

function defaultConfig(
  host: string = "localhost",
  port: number = 3000,
): {
  host: string;
  port: number;
} {
  return { host, port };
}

console.log(defaultConfig());
console.log(defaultConfig("production", 2000));
