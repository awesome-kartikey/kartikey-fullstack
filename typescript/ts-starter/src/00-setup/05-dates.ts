import dayjs from "dayjs";
import type { ConfigType } from "dayjs";

const now: ConfigType = dayjs();
console.log(now.format("YYYY-MM-DD"));

console.log(dayjs("2019-01-25").format("DD/MM/YYYY"));
