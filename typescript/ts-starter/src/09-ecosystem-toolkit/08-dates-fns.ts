import { formatISO, addDays } from "date-fns";
import { nanoid } from "nanoid";
const id = nanoid();
const expires = formatISO(addDays(new Date(), 7));
console.log("Created ID:", id);
console.log("Expires At:", expires);
