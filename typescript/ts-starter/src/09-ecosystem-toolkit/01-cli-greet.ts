import { Command } from "commander";
const program = new Command();
program
  .name("acme")
  .description("Acme CLI")
  .version("1.0.0")
  .option("-v, --verbose", "verbose output");

program.command("hello <name>").action((name, opts) => console.log(`Hello, ${name}!`));

//Build a greet command with --uppercase and --times <n>.

program
  .command("greet <name>")
  .description("Greet a person")
  .option("-u, --uppercase", "Uppercase the greeting")
  .option("-t, --times <n>", "Number of times to greet", "1")
  .action((name, option) => {
    const times = parseInt(option.times);
    if (option.uppercase) {
      console.log(`HELLO ${name.toUpperCase()}`);
    } else {
      console.log(`Hello ${name}`);
    }
    if (option.times > 1) {
      for (let i = 0; i < times; i++) {
        console.log(`Hello ${name}`);
      }
    }
  });

program.parse(process.argv);

// pnpm tsx src/09-ecosystem-toolkit/01-cli-greet.ts greet Kartikey -u -t 4
//tsx 01-cli-greet.ts greet Kartikey -u -t 3
