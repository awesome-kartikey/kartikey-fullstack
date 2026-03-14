const current = process.version;
const major = parseInt(current.slice(1));

console.log("Node version (runtime):", current);
console.log("Major version:", major);

const required = 18;
if (major >= required) {
  console.log(`Version check passed (need >=${required}, got ${major})`);
} else {
  console.error(`Need Node ${required}+, got ${major}. Please upgrade.`);
  process.exit(1);
}
