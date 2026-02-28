import { formatISO, addDays } from "date-fns";
import { nanoid } from "nanoid";
const id = nanoid();
const expires = formatISO(addDays(new Date(), 7));
