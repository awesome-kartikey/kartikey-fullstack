// Install dayjs (runtime) and add code using it.
// Check if types are bundled; if not, pnpm add -D @types/dayjs.
// Verify editor intellisense and tsc --noEmit pass.

import dayjs from "dayjs";
const now = dayjs().format("DD-MM-YYYY");
// dayjs().
