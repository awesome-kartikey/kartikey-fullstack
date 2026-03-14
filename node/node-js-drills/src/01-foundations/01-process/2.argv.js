// Access process.argv and display command-line arguments.
console.log("Arguments:", process.argv);
// Arguments: [
//   '/home/kartikey/.nvm/versions/node/v24.11.1/bin/node',
//   '/home/kartikey/work/kartikey-fullstack/node-js/drills/01-foundations/01-process/2.argv.js'
// ]
console.log("\nYour arguments (excluding node and script path):");
const userArgs = process.argv.slice(2);
console.log(userArgs);

//node 2.argv.js run env help version
