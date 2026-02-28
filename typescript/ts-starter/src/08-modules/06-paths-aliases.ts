// Add "paths": { "@shared/*": ["src/shared/*"] } in tsconfig.json.
// Move a util into src/shared/time.ts, import it via @shared/time in both Node and Next code.

import { getCurrentTime as time } from "@shared/time";

console.log(time());
