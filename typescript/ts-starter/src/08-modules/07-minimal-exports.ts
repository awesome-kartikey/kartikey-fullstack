// Create a small internal lib src/shared/uuid.ts with a default export.
// Switch to named exports and update imports; note tree-shaking benefits.
import { uuid } from "../shared/uuid";

const result = uuid();

console.log(`The result is: ${result}`);
